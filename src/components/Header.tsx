import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AUDIENCES, NAME, type AudienceId } from "../data";

interface HeaderProps {
  audience: AudienceId;
  onAudienceChange: (id: AudienceId) => void;
}

export function Header({ audience, onAudienceChange }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="wordmark" href="#intro">
          {NAME.toLowerCase()}
        </a>
        <AudienceTabs value={audience} onChange={onAudienceChange} />
      </div>
    </header>
  );
}

/**
 * Audience switcher. The active pill is a single absolutely-positioned element
 * that glides and resizes between tabs (transform + width on a floating layer;
 * no reflow of the tabs themselves).
 */
function AudienceTabs({
  value,
  onChange,
}: {
  value: AudienceId;
  onChange: (id: AudienceId) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const updatePill = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-id="${value}"]`);
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  }, [value]);

  useLayoutEffect(updatePill, [updatePill]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(updatePill);
    ro.observe(list);
    // Re-measure once webfonts land so the pill doesn't sit on fallback metrics.
    document.fonts?.ready.then(updatePill).catch(() => {});
    return () => ro.disconnect();
  }, [updatePill]);

  return (
    <div className="tabs" role="tablist" aria-label="Choose your audience" ref={listRef}>
      <span
        className="tab-pill"
        aria-hidden="true"
        style={{
          transform: `translateX(${pill.x}px)`,
          width: pill.w,
          opacity: pill.ready ? 1 : 0,
        }}
      />
      {AUDIENCES.map((a) => (
        <button
          key={a.id}
          data-id={a.id}
          role="tab"
          aria-selected={value === a.id}
          className="tab"
          onClick={(e) => {
            onChange(a.id);
            e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
          }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
