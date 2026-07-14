import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks";
import { defaultProvider } from "./engine";
import type { ChatMessage, ChatProvider, ChatStatus, ProviderMessage } from "./types";

const RETRY_MESSAGE = `Oof, something glitched on my end. Mind giving that another shot?`;

/** Feels considered without feeling slow. */
const THINK_MS_MIN = 450;
const THINK_MS_SPAN = 400;
/** Streaming reveal speed (per word). */
const WORD_MS = 26;

let nextId = 0;
const makeId = (): string => `msg-${++nextId}`;

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    });
  });

export interface UseChatResult {
  messages: ChatMessage[];
  status: ChatStatus;
  /** True once the visitor has sent anything (hides the prompt chips). */
  hasConversed: boolean;
  send: (text: string) => void;
  /** Re-sends the last user message after a failure. */
  retry: () => void;
}

/**
 * Chat state machine: send -> thinking -> streaming -> idle, with a friendly
 * error state that supports retry. The provider returns full text; the hook
 * reveals it word by word (instant under prefers-reduced-motion), so a future
 * hosted provider needs no streaming support to keep the same feel.
 */
export function useChat(provider: ChatProvider = defaultProvider): UseChatResult {
  // Starts empty: the drawer's greeting is UI chrome, not a message.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [hasConversed, setHasConversed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // History as the provider sees it.
  const historyRef = useRef<ProviderMessage[]>([]);
  const lastUserTextRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(
    async (text: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      setStatus("thinking");
      try {
        const history: ProviderMessage[] = [...historyRef.current, { role: "user", content: text }];
        const [reply] = await Promise.all([
          provider.respond(history, signal),
          sleep(THINK_MS_MIN + Math.random() * THINK_MS_SPAN, signal),
        ]);
        if (signal.aborted) return;

        historyRef.current = [...history, { role: "assistant", content: reply }];
        const id = makeId();

        if (reducedMotion) {
          setMessages((prev) => [...prev, { id, role: "assistant", text: reply }]);
          setStatus("idle");
          return;
        }

        setStatus("streaming");
        setMessages((prev) => [...prev, { id, role: "assistant", text: "", streaming: true }]);
        const words = reply.split(/(\s+)/);
        let shown = "";
        for (let i = 0; i < words.length; i += 2) {
          shown += words[i] + (words[i + 1] ?? "");
          const textNow = shown;
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, text: textNow } : m)),
          );
          await sleep(WORD_MS, signal);
        }
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
        setStatus("idle");
      } catch (error) {
        if (signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        setMessages((prev) => [
          ...prev.filter((m) => !m.streaming),
          { id: makeId(), role: "assistant", text: RETRY_MESSAGE, error: true },
        ]);
        setStatus("error");
      }
    },
    [provider, reducedMotion],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || status === "thinking" || status === "streaming") return;
      setHasConversed(true);
      lastUserTextRef.current = text;
      setMessages((prev) => [
        // A retry after an error replaces the failure notice.
        ...prev.filter((m) => !m.error),
        { id: makeId(), role: "user", text },
      ]);
      void run(text);
    },
    [run, status],
  );

  const retry = useCallback(() => {
    if (!lastUserTextRef.current || status === "thinking" || status === "streaming") return;
    setMessages((prev) => prev.filter((m) => !m.error));
    void run(lastUserTextRef.current);
  }, [run, status]);

  return { messages, status, hasConversed, send, retry };
}
