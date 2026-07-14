/**
 * Types for the "Ask" assistant: chat state, provider abstraction, and the
 * structured knowledge base it answers from.
 */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Full text of the message (streaming reveal is a view concern). */
  text: string;
  /** True while the assistant message is still being revealed. */
  streaming?: boolean;
  /** True when this message is a friendly failure notice (shows retry). */
  error?: boolean;
}

export type ChatStatus = "idle" | "thinking" | "streaming" | "error";

/**
 * One entry in the knowledge base. `answer` is the primary response;
 * `more` chunks are served in order for follow-ups ("tell me more").
 */
export interface KnowledgeEntry {
  id: string;
  /** Section label, e.g. "Experience". Purely organizational. */
  section: string;
  /**
   * Keywords that pull this entry up. Multi-word keywords match as phrases
   * and score higher; single words match whole words only.
   */
  keywords: string[];
  answer: string;
  more?: string[];
  /** Entries worth suggesting after this one is exhausted. */
  related?: string[];
}

/** Minimal message shape a provider consumes; mirrors hosted-API formats. */
export interface ProviderMessage {
  role: ChatRole;
  content: string;
}

/**
 * Anything that can produce the next assistant reply. The local retrieval
 * engine implements this today; a hosted LLM (Anthropic, OpenAI) can
 * implement it later without touching the UI or the hook.
 */
export interface ChatProvider {
  respond(history: ProviderMessage[], signal?: AbortSignal): Promise<string>;
}
