import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  /** Input stays visible but inert while the assistant is generating. */
  busy: boolean;
  /** Focus the field without scrolling (used after chip clicks / replies). */
  focusToken: number;
}

const MAX_ROWS = 6;

/**
 * The composer: a bordered rounded box in the familiar chat-app shape, with
 * an auto-growing textarea (Enter sends, Shift+Enter breaks) and a filled
 * arrow send button. Grows to six lines, then scrolls.
 */
export function ChatInput({ onSend, busy, focusToken }: ChatInputProps) {
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-size: measure content, clamp to MAX_ROWS worth of height.
  const resize = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    el.style.height = `${Math.min(el.scrollHeight, line * MAX_ROWS)}px`;
  }, []);

  useEffect(() => {
    if (focusToken > 0) areaRef.current?.focus({ preventScroll: true });
  }, [focusToken]);

  const submit = useCallback(() => {
    if (busy || !value.trim()) return;
    onSend(value);
    setValue("");
    requestAnimationFrame(resize);
  }, [busy, onSend, resize, value]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="chat-input"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={areaRef}
        rows={1}
        value={value}
        placeholder="Ask me anything"
        aria-label="Ask a question"
        disabled={busy}
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={onKeyDown}
      />
      <button
        type="submit"
        className="chat-send"
        disabled={busy || !value.trim()}
        aria-label="Send message"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
