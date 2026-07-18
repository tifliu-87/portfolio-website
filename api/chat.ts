// The .js extension is required: Vercel compiles each .ts file to .js and
// resolves imports as strict ESM, so imports must name the compiled file.
import { buildSystemPrompt } from "../src/chat/systemPrompt.js";

/**
 * Serverless chat endpoint (Vercel). Proxies the conversation to Google's
 * Gemini API so the key stays server-side. The client falls back to the
 * local retrieval engine whenever this endpoint is missing or unhappy, so
 * a keyless deploy or a burned rate limit degrades gracefully.
 *
 * Free tier: get a key at https://aistudio.google.com/apikey and set it as
 * the GEMINI_API_KEY environment variable in Vercel.
 *
 * Uses the classic (req, res) Node handler signature, which every version
 * of Vercel's builder supports; the newer web-handler style crashed with
 * FUNCTION_INVOCATION_FAILED on this project.
 */

/**
 * Flash-Lite has the roomiest free-tier rate limits and answers fast. The
 * -latest alias tracks the current generation; pinned names (for example
 * gemini-2.5-flash-lite) 404 for API keys created after their retirement.
 */
const MODEL = "gemini-flash-lite-latest";

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

/* Minimal request/response shapes so we don't need the @vercel/node dep. */
interface NodeRequest {
  method?: string;
  body?: unknown;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

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

export default async function handler(req: NodeRequest, res: NodeResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Chat API is not configured." });
    return;
  }

  try {
    // Vercel parses JSON bodies; tolerate a raw string just in case.
    const body =
      typeof req.body === "string" ? (JSON.parse(req.body) as { messages?: unknown }) : req.body;
    const messages = sanitize((body as { messages?: unknown } | undefined)?.messages);
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      res.status(400).json({ error: "Expected a message history ending with the visitor." });
      return;
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
      // console.error lands in the Vercel function logs for diagnosis.
      console.error("gemini error", upstream.status, (await upstream.text()).slice(0, 400));
      res.status(upstream.status === 429 ? 429 : 502).json({ error: "Model call failed." });
      return;
    }

    const data = (await upstream.json()) as GeminiResponse;
    const reply = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!reply) {
      res.status(502).json({ error: "Model returned no text." });
      return;
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unexpected error." });
  }
}
