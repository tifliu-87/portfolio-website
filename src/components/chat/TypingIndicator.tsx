import { Avatar } from "./Avatar";

/** Three quiet dots while the assistant is thinking. */
export function TypingIndicator() {
  return (
    <div className="chat-row is-assistant chat-typing-row">
      <Avatar />
      <div className="chat-typing" role="status" aria-label="Assistant is typing">
        <span className="chat-typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="chat-typing-dot" style={{ animationDelay: "160ms" }} />
        <span className="chat-typing-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}
