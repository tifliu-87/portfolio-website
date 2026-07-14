import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useChat } from "../../chat/useChat";
import { useInViewOnce } from "../../hooks";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";
import { TypingIndicator } from "./TypingIndicator";

/**
 * The "Ask" section: an in-flow chat panel in the site's quiet register.
 * Empty state shows a wave, the welcome note, and suggested prompts; once
 * the visitor sends anything the chips step aside for the conversation.
 */
export default function ChatWindow() {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  const { messages, status, hasConversed, send, retry } = useChat();
  const logRef = useRef<HTMLDivElement>(null);
  const [focusToken, setFocusToken] = useState(0);
  const busy = status === "thinking" || status === "streaming";

  // Follow the conversation: smooth-scroll the log (its own scroll container,
  // so the page never jumps) as messages arrive and while text streams in.
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
    if (status === "idle" && hasConversed) setFocusToken((t) => t + 1);
  }, [status, hasConversed]);

  return (
    <section id="ask" ref={ref} className={`ask${inView ? " in" : ""}`}>
      <h2 className="work-title rv" style={{ "--i": 0 } as CSSProperties}>
        Ask me anything
      </h2>
      <p className="ai-lede rv" style={{ "--i": 1 } as CSSProperties}>
        Skip the scrolling if you'd like: this assistant answers from my resume and
        case studies, in my voice.
      </p>
      <div className="chat-panel rv" style={{ "--i": 2 } as CSSProperties}>
        <div
          ref={logRef}
          className={`chat-log${hasConversed ? " has-messages" : ""}`}
          role="log"
          aria-live="polite"
          aria-label="Conversation with Tiffany's AI assistant"
        >
          {!hasConversed && (
            <p className="chat-hello" aria-hidden="true">
              <span className="chat-wave">👋</span> Hi! Ask me anything about Tiffany.
            </p>
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
        {!hasConversed && <PromptChips onPick={handleSend} disabled={busy} />}
        <ChatInput onSend={handleSend} busy={busy} focusToken={focusToken} />
      </div>
    </section>
  );
}
