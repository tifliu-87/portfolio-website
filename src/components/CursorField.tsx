import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks";

/** Stillness before the companion dot dozes off beside the cursor. */
const IDLE_MS = 3_000;

/**
 * Two companions for the cursor, site-wide:
 *
 * Glow: a large, very faint accent-tinted radial wash that trails the cursor
 * on a spring, like carrying a candle across the page. It reads its color
 * from --accent, so it re-tints live as the theme slider moves.
 *
 * Doze: after IDLE_MS without input, a tiny accent dot appears beside the
 * cursor's resting place and snores small z's while the glow dims out; any
 * movement wakes both. Touch and reduced-motion render nothing.
 */
export function CursorField() {
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const napSpot = useRef({ x: 0, y: 0 });
  const off = coarse || reduced;

  useEffect(() => {
    const glow = glowRef.current;
    if (off || !glow) return;

    let raf = 0;
    let animating = false;
    let seen = false;
    let idle: number | undefined;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      glow.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0)`;
      if (Math.hypot(target.x - cur.x, target.y - cur.y) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    };

    const kick = () => {
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      setAsleep(false);
      window.clearTimeout(idle);
      // Scrolling counts as activity but not presence: only nap where a
      // cursor has actually been seen.
      if (!seen) return;
      idle = window.setTimeout(() => {
        napSpot.current = { x: target.x, y: target.y };
        setAsleep(true);
      }, IDLE_MS);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        seen = true;
        cur.x = target.x;
        cur.y = target.y;
      }
      setOn(true);
      wake();
      kick();
    };

    const onLeave = () => setOn(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("scroll", wake);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
    };
  }, [off]);

  if (off) return null;

  return (
    <>
      <div
        ref={glowRef}
        className={`cursor-glow${on && !asleep ? " on" : ""}`}
        aria-hidden="true"
      />
      {asleep && (
        <div
          className="doze"
          aria-hidden="true"
          style={{
            transform: `translate3d(${napSpot.current.x}px, ${napSpot.current.y}px, 0)`,
          }}
        >
          <span className="doze-dot" />
          {[0, 1, 2].map((i) => (
            <span key={i} className="doze-z" style={{ "--i": i } as CSSProperties}>
              z
            </span>
          ))}
        </div>
      )}
    </>
  );
}
