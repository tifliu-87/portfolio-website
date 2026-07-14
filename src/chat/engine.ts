import { FALLBACK_ANSWER, KNOWLEDGE } from "./knowledge";
import type { ChatProvider, KnowledgeEntry, ProviderMessage } from "./types";

/**
 * Local retrieval engine. Scores knowledge entries against the visitor's
 * message, tracks the active topic across turns so follow-ups ("tell me
 * more", "how did that go?") resolve correctly, and never invents content:
 * every reply is authored text from knowledge.ts.
 *
 * Swapping in a hosted LLM later: implement ChatProvider with a fetch to
 * your API (system prompt from systemPrompt.ts, history as-is) and pass it
 * to useChat. Nothing else changes.
 */

const STOPWORDS = new Set(
  "a an and are as at be but by can could did do does for from had has have how i if in is it its me my of on or she her hers that the their them they this to was we what when where which who why will with would you your yours tell about show".split(
    " ",
  ),
);

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9'+\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

/** Whole-word presence, so "ai" never matches inside "said". */
const hasWord = (text: string, word: string): boolean =>
  new RegExp(`(?:^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^a-z0-9]|$)`).test(
    text,
  );

interface Scored {
  entry: KnowledgeEntry;
  score: number;
}

function scoreEntries(query: string): Scored[] {
  const q = ` ${query.toLowerCase()} `;
  const tokens = tokenize(query);
  return KNOWLEDGE.map((entry) => {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (keyword.includes(" ")) {
        // Phrase keywords are strong signals.
        if (q.includes(keyword)) score += 3;
      } else if (hasWord(q, keyword)) {
        score += 2;
      }
    }
    // Light credit for query tokens appearing in the entry id or section.
    for (const token of tokens) {
      if (entry.id.includes(token)) score += 1;
    }
    return { entry, score };
  })
    // A single id-token graze (score 1) is not evidence; require at least a
    // real keyword hit so near-misses fall back honestly instead of guessing.
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score);
}

/* ------------------------------ Intent helpers ------------------------------ */

const FOLLOW_UP_RE =
  /\b(tell me more|more detail|say more|go deeper|deeper|elaborate|go on|keep going|continue|expand|what else|and then|more please|how did (that|it) go|what about (that|it)|more about (that|it)|why is that|how so)\b/i;

/** Short, pronoun-heavy messages read as follow-ups even without a keyword. */
const isFollowUp = (query: string): boolean => {
  if (FOLLOW_UP_RE.test(query)) return true;
  const tokens = tokenize(query);
  return tokens.length === 0 && /\b(that|it|more|why|how)\b/i.test(query);
};

const GREETING_RE = /^\s*(hi|hey|hello|howdy|yo|hiya|good (morning|afternoon|evening))[\s!,.?]*$/i;
const THANKS_RE = /\b(thanks|thank you|thx|appreciate)\b/i;
const BYE_RE = /^\s*(bye|goodbye|see you|later|cya|take care)[\s!,.?]*$/i;

const GREETING_REPLY = `Hey! Good to meet you.

Ask me whatever you're curious about: my work, my projects, how I think about design, what I'm looking for. Or grab one of the suggestions below.`;

const THANKS_REPLY = `Anytime! If anything else pops into your head, I'm right here.

And if you'd rather talk to the actual human version of me, just ask for my email.`;

const BYE_REPLY = `See you around! Go poke through the case studies if you haven't yet. Thanks for stopping by :)`;

/* ------------------------------ Topic tracking ------------------------------ */

/** Casual, sentence-ready names for topics ("Want to hear about ...?"). */
const TOPIC_TITLES: Record<string, string> = {
  about: "a quick intro",
  education: "school",
  beacons: "my time at Beacons",
  coldreach: "Coldreach",
  nava: "NAVA, the startup I co-founded",
  jila: "Jila",
  anda: "Anda",
  cubec: "my consulting work",
  leadership: "leadership stuff",
  technical: "what I build with",
  "ai-fluency": "how I use AI",
  "design-process": "how I design",
  "pm-philosophy": "how I think about product",
  problems: "the kinds of problems I love",
  favorite: "my favorite projects",
  impact: "the numbers behind my work",
  "looking-for": "what I'm looking for next",
  "off-resume": "something that's not on my resume",
  contact: "how to reach me",
};

const titleFor = (id: string): string => TOPIC_TITLES[id] ?? id.replace(/-/g, " ");

/**
 * Replays the conversation to rebuild topic state (which entry is active and
 * how many of its chunks have been served). Stateless between calls, so the
 * provider needs no reset logic and survives message retries.
 */
function replayTopics(history: ProviderMessage[]): Map<string, number> & { last?: string } {
  const served: Map<string, number> & { last?: string } = new Map();
  let last: string | undefined;
  for (const message of history) {
    if (message.role !== "assistant") continue;
    for (const entry of KNOWLEDGE) {
      const chunks = [entry.answer, ...(entry.more ?? [])];
      const index = chunks.findIndex((c) => c === message.content);
      if (index >= 0) {
        served.set(entry.id, Math.max(served.get(entry.id) ?? 0, index + 1));
        last = entry.id;
      }
    }
  }
  served.last = last;
  return served;
}

function nextChunk(entry: KnowledgeEntry, served: Map<string, number>): string | undefined {
  const chunks = [entry.answer, ...(entry.more ?? [])];
  const count = served.get(entry.id) ?? 0;
  return chunks[count];
}

/** When a topic is exhausted, hand the visitor somewhere real to go next. */
function exhaustedReply(entry: KnowledgeEntry): string {
  const suggestions = (entry.related ?? [])
    .map(titleFor)
    .slice(0, 2)
    .join(" or ");
  return suggestions
    ? `Honestly, that's about everything I've got on that one here. Want to hear about ${suggestions}? Or throw me something totally different.`
    : `Honestly, that's about everything I've got on that one here, but ask me anything else!`;
}

/* --------------------------------- Provider --------------------------------- */

export class LocalKnowledgeProvider implements ChatProvider {
  async respond(history: ProviderMessage[]): Promise<string> {
    const lastUser = [...history].reverse().find((m) => m.role === "user");
    const query = lastUser?.content.trim() ?? "";
    if (!query) return FALLBACK_ANSWER;

    if (GREETING_RE.test(query)) return GREETING_REPLY;
    if (BYE_RE.test(query)) return BYE_REPLY;

    const served = replayTopics(history);
    const scored = scoreEntries(query);
    const followUp = isFollowUp(query);

    // Follow-ups with no stronger topic of their own continue the last topic.
    if (followUp && served.last && (scored.length === 0 || scored[0].score <= 2)) {
      const entry = KNOWLEDGE.find((e) => e.id === served.last);
      if (entry) {
        const chunk = nextChunk(entry, served);
        if (chunk) return chunk;
        // Primary chunk exhausted: try the first unserved related entry.
        for (const relatedId of entry.related ?? []) {
          const related = KNOWLEDGE.find((e) => e.id === relatedId);
          const relatedChunk = related && nextChunk(related, served);
          if (relatedChunk) return relatedChunk;
        }
        return exhaustedReply(entry);
      }
    }

    if (scored.length > 0) {
      const entry = scored[0].entry;
      const chunk = nextChunk(entry, served);
      if (chunk) return chunk;
      // Asked again about a fully-served topic: recap with the primary answer.
      return entry.answer;
    }

    // Thanks reads as small talk only when nothing substantive matched.
    if (THANKS_RE.test(query)) return THANKS_REPLY;

    return FALLBACK_ANSWER;
  }
}

export const defaultProvider: ChatProvider = new LocalKnowledgeProvider();
