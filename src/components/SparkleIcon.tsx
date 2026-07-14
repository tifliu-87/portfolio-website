/**
 * Four-point sparkle marking the chat entry points; the accent color and
 * the shape together read as "AI lives here". Inherits currentColor so the
 * .ask-sparkle class (and the theme slider) can tint it.
 */
export function SparkleIcon() {
  return (
    <svg
      className="ask-sparkle"
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0c.4 4.1 2.4 6.8 8 8-5.6 1.2-7.6 3.9-8 8-.4-4.1-2.4-6.8-8-8 5.6-1.2 7.6-3.9 8-8Z" />
    </svg>
  );
}
