import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "../data";
import { usePrefersReducedMotion } from "../hooks";

/**
 * Dotted section rail with scroll progress. Active dot is chosen by an
 * IntersectionObserver band around the viewport center; the progress hairline
 * fills via transform: scaleY (no layout, rAF-throttled).
 */
export function NavRail() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        trackRef.current?.style.setProperty("--progress", p.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className="nav-rail" aria-label="Sections">
      <div className="rail-track" ref={trackRef}>
        <div className="rail-progress" aria-hidden="true" />
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className="rail-dot"
            aria-current={active === s.id}
            aria-label={s.label}
            onClick={() =>
              document
                .getElementById(s.id)
                ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
            }
          >
            <span className="rail-label">{s.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
