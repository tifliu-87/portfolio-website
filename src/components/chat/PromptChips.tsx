import { memo } from "react";
import { SUGGESTED_PROMPTS } from "../../chat/knowledge";

interface PromptChipsProps {
  onPick: (prompt: string) => void;
  disabled?: boolean;
}

/**
 * Clickable starting points, shown only before the conversation begins.
 * Plain bordered pills in the site's quiet register; accent arrives on hover.
 */
export const PromptChips = memo(function PromptChips({ onPick, disabled }: PromptChipsProps) {
  return (
    <div className="chat-chips" role="list" aria-label="Suggested questions">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          role="listitem"
          className="chat-chip"
          disabled={disabled}
          onClick={() => onPick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
});
