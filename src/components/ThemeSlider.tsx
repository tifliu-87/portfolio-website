import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_THEME_VALUE,
  THEME_STOPS,
  getThemeValue,
  setThemeValue,
} from "../theme";
import { EASE_OUT_EXPO, useIsNarrow, usePrefersReducedMotion } from "../hooks";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Theme control. Desktop: a draggable vertical slider on the right rail with
 * an elastic settle on release (the one place a spring overshoot is intended).
 * Narrow screens: a simplified row of tappable swatches.
 * All animation runs imperatively via rAF; React re-renders only when the
 * discrete stop changes (for aria state).
 */
export function ThemeSlider() {
  const narrow = useIsNarrow();
  const reduced = usePrefersReducedMotion();
  const spanRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const dragging = useRef(false);
  const peekTimer = useRef<number | undefined>(undefined);
  const [stop, setStop] = useState(Math.round(getThemeValue()));
  // While interacting, the rail label reads the nearest stop's name; it
  // settles back to "shade" shortly after the theme stops moving.
  const [peeking, setPeeking] = useState(false);

  const positionHandle = useCallback(() => {
    const span = spanRef.current;
    const handle = handleRef.current;
    if (!span || !handle) return;
    const y = (getThemeValue() / MAX_THEME_VALUE) * span.clientHeight;
    handle.style.transform = `translateY(${y}px)`;
  }, []);

  const peek = useCallback(() => {
    setPeeking(true);
    window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => setPeeking(false), 1200);
  }, []);

  const commit = useCallback(
    (v: number) => {
      const clamped = clamp(v, 0, MAX_THEME_VALUE);
      setThemeValue(clamped);
      setStop(Math.round(clamped));
      positionHandle();
      peek();
    },
    [positionHandle, peek],
  );

  const cancelAnim = useCallback(() => cancelAnimationFrame(raf.current), []);

  /** Glide to a stop with the shared ease-out-expo at the large-reveal duration. */
  const animateTo = useCallback(
    (target: number) => {
      cancelAnim();
      setStop(target);
      if (reduced) {
        commit(target);
        return;
      }
      const from = getThemeValue();
      const start = performance.now();
      const dur = 750;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        commit(from + (target - from) * EASE_OUT_EXPO(t));
        if (t < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [cancelAnim, commit, reduced],
  );

  /** Release settle: a lightly underdamped spring so the handle lands with life. */
  const springTo = useCallback(
    (target: number) => {
      cancelAnim();
      setStop(Math.round(target));
      if (reduced) {
        commit(target);
        return;
      }
      let v = getThemeValue();
      let vel = 0;
      let last = performance.now();
      const stiffness = 220;
      const damping = 17;
      const step = (now: number) => {
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;
        vel += (-stiffness * (v - target) - damping * vel) * dt;
        v += vel * dt;
        if (Math.abs(v - target) < 0.001 && Math.abs(vel) < 0.01) {
          commit(target);
          return;
        }
        commit(v);
        raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [cancelAnim, commit, reduced],
  );

  // Keep the handle aligned on mount / resize / breakpoint flips.
  useEffect(() => {
    positionHandle();
    const span = spanRef.current;
    if (!span) return;
    const ro = new ResizeObserver(positionHandle);
    ro.observe(span);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      window.clearTimeout(peekTimer.current);
    };
  }, [positionHandle, narrow]);

  if (narrow) {
    return (
      <div className="theme-swatches" role="group" aria-label="Site color theme">
        {THEME_STOPS.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={stop === i}
            aria-label={s.name}
            style={{ background: `hsl(${s.accent[0]} ${s.accent[1]}% ${s.accent[2]}%)` }}
            onClick={() => animateTo(i)}
          />
        ))}
      </div>
    );
  }

  const valueFromPointer = (clientY: number) => {
    const span = spanRef.current;
    if (!span) return getThemeValue();
    const rect = span.getBoundingClientRect();
    const y = clamp(clientY - rect.top, 0, rect.height);
    return (y / rect.height) * MAX_THEME_VALUE;
  };

  return (
    <div className="theme-slider">
      <span className="swatch-label" aria-hidden="true">
        {peeking ? THEME_STOPS[stop].name.toLowerCase() : "shade"}
      </span>
      <div
        className="slider-track"
        role="slider"
        tabIndex={0}
        aria-label="Site color theme"
        aria-valuemin={0}
        aria-valuemax={MAX_THEME_VALUE}
        aria-valuenow={stop}
        aria-valuetext={THEME_STOPS[stop].name}
        aria-orientation="vertical"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          cancelAnim();
          dragging.current = true;
          commit(valueFromPointer(e.clientY));
        }}
        onPointerMove={(e) => {
          if (dragging.current) commit(valueFromPointer(e.clientY));
        }}
        onPointerUp={() => {
          if (!dragging.current) return;
          dragging.current = false;
          springTo(Math.round(getThemeValue()));
        }}
        onPointerCancel={() => {
          dragging.current = false;
          springTo(Math.round(getThemeValue()));
        }}
        onKeyDown={(e) => {
          const cur = Math.round(getThemeValue());
          let next: number | null = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") next = clamp(cur + 1, 0, MAX_THEME_VALUE);
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = clamp(cur - 1, 0, MAX_THEME_VALUE);
          if (e.key === "Home") next = 0;
          if (e.key === "End") next = MAX_THEME_VALUE;
          if (next !== null) {
            e.preventDefault();
            animateTo(next);
          }
        }}
      >
        <div className="slider-rail" aria-hidden="true" />
        <div className="slider-span" ref={spanRef}>
          {THEME_STOPS.map((s, i) => (
            <button
              key={s.id}
              className="slider-tick"
              type="button"
              tabIndex={-1}
              aria-label={s.name}
              style={{ top: `${(i / MAX_THEME_VALUE) * 100}%` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => animateTo(i)}
            />
          ))}
          <div className="slider-handle" ref={handleRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
