import { buildSystemPrompt } from "../src/chat/systemPrompt";

/**
 * Serverless chat endpoint (Vercel). Proxies the conversation to Google's
 * Gemini API so the key stays server-side. The client falls back to the
 * local retrieval engine whenever this endpoint is missing or unhappy, so
 * a keyless deploy or a burned rate limit degrades gracefully.
 *
 * Free tier: get a key at https://aistudio.google.com/apikey and set it as
 * the GEMINI_API_KEY environment variable in Vercel.
 */

/** Flash-Lite has the roomiest free-tier rate limits and answers fast. */
const MODEL = "gemini-2.5-flash-lite";

/* Keep strangers from burning the free quota with giant payloads. */
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function sanitize(raw: unknown): IncomingMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is IncomingMessage =>
        typeof m === "object" &&
        m !== null &&
        ((m as IncomingMessage).role === "user" || (m as IncomingMessage).role === "assistant") &&
        typeof (m as IncomingMessage).content === "string" &&
        (m as IncomingMessage).content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "Chat API is not configured." }, 503);

  let messages: IncomingMessage[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    messages = sanitize(body.messages);
  } catch {
    return json({ error: "Malformed request body." }, 400);
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "Expected a message history ending with the visitor." }, 400);
  }

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt() }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
      }),
    },
  );
  if (!upstream.ok) {
    return json({ error: "Model call failed." }, upstream.status === 429 ? 429 : 502);
  }

  const data = (await upstream.json()) as GeminiResponse;
  const reply = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!reply) return json({ error: "Model returned no text." }, 502);

  return json({ reply });
}
