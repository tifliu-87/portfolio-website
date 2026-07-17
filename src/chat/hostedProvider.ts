import { LocalKnowledgeProvider } from "./engine";
import type { ChatProvider, ProviderMessage } from "./types";

/**
 * Hosted LLM provider: posts the conversation to /api/chat (a serverless
 * function that calls Gemini; see api/chat.ts) and quietly falls back to
 * the local retrieval engine when the endpoint is absent, rate limited, or
 * down. That keeps plain `npm run dev` and keyless deploys fully working.
 */
export class HostedChatProvider implements ChatProvider {
  private fallback = new LocalKnowledgeProvider();

  async respond(history: ProviderMessage[], signal?: AbortSignal): Promise<string> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal,
      });
      if (response.ok) {
        const data = (await response.json()) as { reply?: unknown };
        if (typeof data.reply === "string" && data.reply.trim()) return data.reply;
      }
    } catch (error) {
      // A cancelled send should stay cancelled, not answer from the fallback.
      if (error instanceof DOMException && error.name === "AbortError") throw error;
    }
    return this.fallback.respond(history);
  }
}

export const hostedProvider: ChatProvider = new HostedChatProvider();
