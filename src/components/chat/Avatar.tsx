/**
 * The assistant's mark: a small accent dot with a soft ring, kin to the
 * dozing cursor companion. Reads --accent live, so the theme slider
 * re-tints it in place.
 */
export function Avatar() {
  return (
    <span className="chat-avatar" aria-hidden="true">
      <span className="chat-avatar-dot" />
    </span>
  );
}
