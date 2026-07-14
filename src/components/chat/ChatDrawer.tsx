import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NAME } from "../../data";
import { SUGGESTED_PROMPTS } from "../../chat/knowledge";
import { useChat } from "../../chat/useChat";
import { Avatar } from "./Avatar";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import { TypingIndicator } from "./TypingIndicator";

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** How many prompt chips are visible at once. */
const CHIP_COUNT = 3;

/**
 * The chat, as a drawer sliding in from the right edge over a light scrim.
 * Stays mounted after the first open so the conversation survives closing.
 * Empty state is a bare greeting; three suggestion chips sit above the
 * composer and rotate to a fresh trio after every question.
 */
export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const { messages, status, hasConversed, send, retry } = useChat();
  const logRef = useRef<HTMLDivElement>(null);
  const [focusToken, setFocusToken] = useState(0);
  const busy = status === "thinking" || status === "streaming";

  // Mounts closed, then slides in: the .open class lands one frame after
  // render so the transform transition runs even on the very first open.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  // While open: Escape closes, the page behind doesn't scroll, composer gets focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setFocusToken((t) => t + 1);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Rotate the chips: a fresh trio after every visitor question, wrapping
  // around the pool so there are always suggestions on offer.
  const asked = messages.filter((m) => m.role === "user").length;
  const chips = useMemo(() => {
    const start = (asked * CHIP_COUNT) % SUGGESTED_PROMPTS.length;
    return Array.from(
      { length: CHIP_COUNT },
      (_, i) => SUGGESTED_PROMPTS[(start + i) % SUGGESTED_PROMPTS.length],
    );
  }, [asked]);

  // Follow the conversation: smooth-scroll the log as messages arrive and
  // while text streams in.
  const lastMessage = messages[messages.length - 1];
  useEffect(() => {
    if (!hasConversed) return;
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [hasConversed, messages.length, lastMessage?.text, status]);

  const handleSend = useCallback(
    (text: string) => {
      send(text);
      setFocusToken((t) => t + 1);
    },
    [send],
  );

  // Refocus the composer once a reply settles, so follow-ups flow.
  useEffect(() => {
    if (open && status === "idle" && hasConversed) setFocusToken((t) => t + 1);
  }, [open, status, hasConversed]);

  return (
    <div className={`chat-root${shown ? " open" : ""}`} inert={!open}>
      <div className="chat-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="chat-drawer" role="dialog" aria-modal="true" aria-label="Chat">
        <header className="chat-head">
          <span className="chat-head-name">
            <Avatar />
            {NAME.toLowerCase()}
          </span>
          <button type="button" className="chat-close" onClick={onClose} aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div
          ref={logRef}
          className="chat-log"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {!hasConversed && (
            <div className="chat-hello">
              <p className="chat-hello-title">Hey! Ask me anything :)</p>
              <p className="chat-hello-sub">
                My work, my projects, how I think about product, what I'm looking
                for next. It's all fair game.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRetry={message.error ? retry : undefined}
            />
          ))}
          {status === "thinking" && <TypingIndicator />}
        </div>
        <div className="chat-foot">
          <PromptChips prompts={chips} onPick={handleSend} disabled={busy} />
          <ChatInput onSend={handleSend} busy={busy} focusToken={focusToken} />
        </div>
      </aside>
    </div>
  );
}
