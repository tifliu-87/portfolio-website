import { useEffect, useRef, useState } from "react";
import { getResolvedTheme, subscribeTheme } from "../theme";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks";

/**
 * Mouse-reveal interlude. A canvas covers a colored quote; moving the cursor
 * erases the cover with a feathered brush that trails the pointer on an eased
 * follow, so the color feels like silk being pulled back. The erased areas
 * persist. On touch devices / reduced motion the cover simply crossfades away
 * when the panel is tapped or scrolled well into view.
 */
export function RevealPanel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const fallback = coarse || reduced;
  const [bared, setBared] = useState(false);

  // Paint (and keep re-tinting) the cover — both modes need it.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cover = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = getResolvedTheme().css.surface;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const size = () => {
      canvas.width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(wrap.clientHeight * dpr));
      cover();
    };
    size();

    const ro = new ResizeObserver(size);
    ro.observe(wrap);
    // Re-tint remaining cover pixels when the theme shifts (keeps alpha holes).
    const unsubscribe = subscribeTheme((theme) => {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = theme.css.surface;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    });
    return () => {
      ro.disconnect();
      unsubscribe();
    };
  }, []);

  // Interactive cursor-trail mode (fine pointers, motion allowed).
  useEffect(() => {
    if (fallback) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let animating = false;
    let hasPointer = false;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    // Feathered brush, erased via destination-out so progress accumulates.
    const brush = (x: number, y: number) => {
      const radius = Math.max(120, canvas.width / dpr / 7) * dpr;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(0,0,0,0.9)");
      g.addColorStop(0.5, "rgba(0,0,0,0.45)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.13;
      cur.y += (target.y - cur.y) * 0.13;
      brush(cur.x * dpr, cur.y * dpr);
      if (Math.hypot(target.x - cur.x, target.y - cur.y) > 0.6) {
        raf = requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!hasPointer) {
        hasPointer = true;
        cur.x = target.x;
        cur.y = target.y;
        wrap.classList.add("touched");
      }
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    wrap.addEventListener("pointermove", onMove);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fallback]);

  // Fallback mode: reveal on tap, or automatically once well in view.
  useEffect(() => {
    if (!fallback) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setBared(true);
          io.disconnect();
        }
      },
      { threshold: 0.65 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [fallback]);

  return (
    <div className="interlude">
      <div
        ref={wrapRef}
        className={`reveal-panel${bared ? " bared touched" : ""}`}
        onClick={fallback ? () => setBared(true) : undefined}
      >
        <div className="reveal-under">
          <blockquote>
            Good products aren&rsquo;t built. They&rsquo;re <em>noticed</em>.
          </blockquote>
        </div>
        <canvas ref={canvasRef} className="reveal-canvas" aria-hidden="true" />
        <p className="reveal-hint" aria-hidden="true">
          {fallback ? "tap to reveal" : "move your cursor to reveal"}
        </p>
      </div>
    </div>
  );
}
