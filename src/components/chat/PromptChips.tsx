import { memo } from "react";

interface PromptChipsProps {
  /** The three prompts currently on rotation (see ChatDrawer). */
  prompts: string[];
  onPick: (prompt: string) => void;
  disabled?: boolean;
}

/**
 * Clickable starting points, persistent above the composer; the drawer
 * rotates in a fresh trio after every question. Plain bordered pills in the
 * site's quiet register; accent arrives on hover.
 */
export const PromptChips = memo(function PromptChips({
  prompts,
  onPick,
  disabled,
}: PromptChipsProps) {
  return (
    <div className="chat-chips" role="list" aria-label="Suggested questions">
      {prompts.map((prompt) => (
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
