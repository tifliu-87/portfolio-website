# AI Chat Assistant: Build Progress

Working doc so this task can be resumed mid-flight. Update the checklist as steps land.

## Decisions made (do not re-litigate on resume)

- **Placement** (revised 2026-07-13, per Tiffany): a drawer sliding in from the
  right edge over a light scrim, NOT an in-flow section and NOT a floating
  bubble widget. Two entry points: an "ask me anything" pill under the hero
  name, and an "Ask" button in the site header. The drawer stays mounted after
  first open so closing never loses the conversation.
- **Engine**: local retrieval over a structured knowledge base (no backend exists;
  the site is a static Vite build). A `ChatProvider` interface abstracts generation
  so an Anthropic/OpenAI provider can be dropped in later without refactoring.
  The system prompt for that future API lives in `src/chat/systemPrompt.ts` now.
- **Voice** (revised 2026-07-13, per Tiffany): casual and friendly, never
  "AI assistant" framing. There is no welcome message bubble; the empty state
  is a bare "Hey! Ask me anything :)" greeting (no emoji). Small-talk and
  fallback replies are written like texting a friend.
- **Chips** (revised 2026-07-13, per Tiffany): exactly 3 at a time, persistent
  above the composer, rotating to a fresh trio from the 10-prompt pool after
  every question.
- **Composer** (revised 2026-07-13, per Tiffany): a bordered rounded input box
  in the familiar chat-app shape (like Claude's), nearly untinted, with a
  filled circular send button.
- **Copy rules honored**: no em-dashes anywhere, no years-of-experience claims,
  product-first positioning, concise chunked answers.
- **Design**: tokens from global.css only (var(--ease), three durations, tonal
  surfaces, no drop shadows, accent <= 10% of screen). Typewriter reveal for
  assistant messages; disabled under prefers-reduced-motion.
- **Knowledge source**: resume PDF (public/resume.pdf, read 2026-07-13) + src/data.ts.
  Projects with no case-study copy (Anda, Jamtown Cube, NAVA page, Aura, Axial)
  get only what data.ts says; the assistant says the case study is in progress
  rather than inventing details.

## File map

| File | Purpose |
| --- | --- |
| `src/chat/types.ts` | All chat + knowledge types |
| `src/chat/knowledge.ts` | Structured knowledge base (edit here to change answers) |
| `src/chat/systemPrompt.ts` | System prompt for future hosted-LLM providers |
| `src/chat/engine.ts` | Provider interface + local retrieval provider |
| `src/chat/useChat.ts` | Chat state machine hook (send, retry, streaming reveal) |
| `src/components/chat/ChatDrawer.tsx` | The drawer: scrim, header, log, chips, composer |
| `src/components/chat/MessageBubble.tsx` | One message |
| `src/components/chat/TypingIndicator.tsx` | Three-dot thinking pulse |
| `src/components/chat/PromptChips.tsx` | The 3 rotating suggestion chips |
| `src/components/chat/ChatInput.tsx` | Bordered composer box; Enter/Shift+Enter |
| `src/components/chat/Avatar.tsx` | Small accent-dot avatar |
| `src/styles/global.css` | Chat styles under the "Ask (chat drawer)" banner |
| `src/App.tsx` | Owns open state; lazy-mounts ChatDrawer on first open |
| `src/components/SiteHeader.tsx` | "Ask" button entry point |
| `src/components/Hero.tsx` | "ask me anything" pill entry point under the name |

## Checklist

- [x] Explore codebase, read DESIGN.md / PRODUCT.md / resume / data.ts
- [x] types.ts
- [x] knowledge.ts (content drafted from resume + data.ts)
- [x] systemPrompt.ts
- [x] engine.ts (retrieval, follow-ups, small talk, fallback)
- [x] useChat.ts
- [x] Components (Avatar, MessageBubble, TypingIndicator, PromptChips, ChatInput, ChatWindow)
- [x] CSS in global.css (before reduced-motion block; .chat-row added to RM list)
- [x] Wire into App.tsx (lazy) + SiteHeader "Ask" link
- [x] Typecheck + build passes (ChatWindow is its own lazy chunk, ~10 kB gzip)
- [x] Verify in preview: chips send + hide, streaming reveal, "tell me more"
      continues the Beacons topic, unknown question ("favorite ice cream
      flavor") falls back honestly, auto-scroll + input refocus, mobile 375px
      has no overflow
- [x] Final pass: no em-dashes in src (grepped), accessibility (role=log,
      aria-live, labels, focus ring), docs

## Redesign pass (2026-07-13, requested by Tiffany)

- In-page `#ask` section replaced by a right-edge drawer (`ChatDrawer.tsx`;
  `ChatWindow.tsx` deleted). Escape, scrim click, and the header × all close
  it; body scroll locks while open; conversation survives close/reopen.
- Entry points: hero pill under the name + header "Ask" button (was an anchor).
- Welcome bubble and wave emoji removed; empty state is a centered
  "Hey! Ask me anything :)". No "Tiffany's AI assistant" framing anywhere.
- Chips cut to 3 visible, persistent, rotating through the pool per question.
- Composer restyled as a bordered rounded box with a filled send button;
  tint reduced throughout (plain --bg drawer, softer user bubbles).
- Copy casualized: fallback, greeting/thanks/bye, retry, exhausted-topic
  replies, and the hosted-LLM system prompt's voice section.
- Verified in preview: both entry points, chip rotation, "tell me more"
  follow-up, close/reopen persistence, mobile full-width drawer, no console
  errors; typecheck + build pass.

## Status: COMPLETE (2026-07-13)

Two bugs found and fixed during verification:
1. Bare "favorite" keyword caught "favorite ice cream flavor"; favorite entry
   now uses phrase keywords only.
2. Engine matched entries on a lone id-token graze (score 1); minimum match
   score is now 2 (at least one real keyword hit).

## Next steps (optional, not started)

- Personalize the `// TODO(tiffany)` answers in src/chat/knowledge.ts
- Hosted LLM: implement ChatProvider with a serverless endpoint + the prompt
  from src/chat/systemPrompt.ts, pass it to useChat in ChatWindow.tsx
- Add case-study facts for Anda etc. to knowledge.ts as they're written

## Content flagged for Tiffany to personalize later

Marked with `// TODO(tiffany)` in knowledge.ts:

- "Favorite project" answer (drafted a defensible one; make it true)
- "Why product management" origin story (drafted from positioning docs)
- "What are you looking for" (kept honest and generic: internships + interesting problems)
- Fun facts (only site-derived facts used: theme slider, hidden words, dozing cursor)
