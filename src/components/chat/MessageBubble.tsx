import { memo } from "react";
import type { ChatMessage } from "../../chat/types";
import { Avatar } from "./Avatar";

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
}

/** Renders bare URLs and email addresses as real links; everything else as text. */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(https?:\/\/\S+|\/resume\.pdf|\S+@\S+\.\S+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[).,]+$/, "");
      return (
        <a key={i} href={clean} target="_blank" rel="noreferrer">
          {clean}
        </a>
      );
    }
    if (part === "/resume.pdf") {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer">
          resume
        </a>
      );
    }
    if (/^\S+@\S+\.\S+$/.test(part)) {
      const clean = part.replace(/[).,]+$/, "");
      return (
        <a key={i} href={`mailto:${clean}`}>
          {clean}
        </a>
      );
    }
    return part;
  });
}

/**
 * One chat message. Assistant messages sit on the page (tonal, no chrome)
 * behind the avatar mark; visitor messages are quiet surface pills on the
 * right. Memoized: during the streaming reveal only the newest message
 * changes, so settled ones never re-render.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  onRetry,
}: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const paragraphs = message.text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className={`chat-row ${isAssistant ? "is-assistant" : "is-user"}`}>
      {isAssistant && <Avatar />}
      <div className="chat-bubble">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{renderInline(paragraph)}</p>
        ))}
        {message.streaming && <span className="chat-caret" aria-hidden="true" />}
        {message.error && onRetry && (
          <button type="button" className="chat-retry" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
});
