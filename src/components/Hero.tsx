import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AUDIENCES,
  EMAIL,
  HERO_COPY,
  HIDDEN_WORDS,
  LINKEDIN_URL,
  MACHINE_COPY,
  NAME,
  PHRASE_REVEALS,
  RESUME_URL,
  type AudienceId,
  type PhraseKey,
} from "../data";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks";

/**
 * Hero: the framed content box (audience tabs + intro sentence on the left,
 * name / role / contact links on the right) sits inside open gutters, and a
 * "field" layer spanning the whole section hosts the cursor-following invert
 * veil plus hidden words scattered around the box on all four sides. Words
 * are invisible until the cursor passes near them, then stay lit (like
 * creativefellowship.google); the veil slides underneath the box. On touch
 * or reduced-motion the field is simply not rendered.
 */
export function Hero() {
  const [audience, setAudience] = useState<AudienceId>("everyone");
  const [active, setActive] = useState<PhraseKey | null>(null);
  const [shown, setShown] = useState<PhraseKey>("pm");
  const closeTimer = useRef<number | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setActive(null);
    return () => window.clearTimeout(closeTimer.current);
  }, [audience]);

  // Cursor-following invert veil plus proximity reveal of the hidden words.
  // Once a word is lit it stays lit for the rest of the visit.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || coarse || reduced) return;
    const words = Array.from(section.querySelectorAll<HTMLElement>(".hero-word"));
    const veil = section.querySelector<HTMLElement>(".hero-veil");

    let raf = 0;
    let animating = false;
    let hasPointer = false;
    let litCount = 0;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let centers: { el: HTMLElement; x: number; y: number }[] = [];

    const measure = () => {
      const sr = section.getBoundingClientRect();
      centers = words.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    // Word reveal radius matches the veil radius, so lighting up reads as
    // "the circle uncovered the text". Keep in sync with .hero-veil size.
    const REVEAL_RADIUS = 110;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      if (veil) veil.style.transform = `translate3d(${cur.x - REVEAL_RADIUS}px, ${cur.y - REVEAL_RADIUS}px, 0)`;
      if (litCount < centers.length) {
        for (const c of centers) {
          if (Math.hypot(c.x - cur.x, c.y - cur.y) < REVEAL_RADIUS && !c.el.classList.contains("lit")) {
            c.el.classList.add("lit");
            litCount++;
          }
        }
      }
      if (Math.hypot(target.x - cur.x, target.y - cur.y) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!hasPointer) {
        hasPointer = true;
        cur.x = target.x;
        cur.y = target.y;
        if (veil) veil.style.transform = `translate3d(${cur.x - REVEAL_RADIUS}px, ${cur.y - REVEAL_RADIUS}px, 0)`;
      }
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => veil?.classList.add("on");
    const onLeave = () => veil?.classList.remove("on");

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [coarse, reduced]);

  const open = (key: PhraseKey) => {
    window.clearTimeout(closeTimer.current);
    setShown(key);
    setActive(key);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 150);
  };

  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const copy = audience === "machines" ? null : HERO_COPY[audience];

  const fieldOn = !coarse && !reduced;

  return (
    <section id="intro" className={`hero${fieldOn ? " with-field" : ""}`} ref={sectionRef}>
      {/* Layer spanning the whole section, underneath the framed box: hidden
          words + invert veil. Words stay invisible until the cursor reveals
          them, then stay lit. */}
      {fieldOn && (
        <div className="hero-field" aria-hidden="true">
          <div className="hero-words">
            {HIDDEN_WORDS.map((w, i) => (
              <span key={i} className="hero-word" style={{ left: `${w.x}%`, top: `${w.y}%` }}>
                {w.text}
              </span>
            ))}
          </div>
          <div className="hero-veil" />
        </div>
      )}

      <div className="hero-frame">
        <div className="hero-grid">
          <div className="hero-main">
            <nav className="tabs-plain" aria-label="Choose your audience">
              {AUDIENCES.map((a) => (
                <button
                  key={a.id}
                  className={audience === a.id ? "on" : ""}
                  aria-pressed={audience === a.id}
                  onClick={() => setAudience(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </nav>

            {audience === "machines" ? (
              <pre className="machine-block" key="machines" tabIndex={0}>
                {MACHINE_COPY.split("\n").map((line, i) => {
                  const m = line.match(/^(\s*[\w[\]]+):(.*)$/);
                  return (
                    <span key={i}>
                      {m ? (
                        <>
                          <span className="mk">{m[1]}</span>:{m[2]}
                        </>
                      ) : (
                        line
                      )}
                      {"\n"}
                    </span>
                  );
                })}
              </pre>
            ) : (
              <>
                <h1 className="hero-line" key={audience}>
                  {copy!.segments.map((seg, i) => {
                    const style = { "--i": i } as CSSProperties;
                    if (!seg.phrase) {
                      return (
                        <span key={i} className="hero-seg" style={style}>
                          {seg.text}
                        </span>
                      );
                    }
                    const phrase = seg.phrase;
                    const isOpen = active === phrase;
                    // Span with button semantics so the phrase wraps like text.
                    return (
                      <span
                        key={i}
                        role="button"
                        tabIndex={0}
                        className={`hero-seg phrase${isOpen ? " on" : ""}`}
                        style={style}
                        aria-expanded={isOpen}
                        onPointerEnter={coarse ? undefined : () => open(phrase)}
                        onPointerLeave={coarse ? undefined : scheduleClose}
                        onFocus={() => open(phrase)}
                        onBlur={scheduleClose}
                        onClick={() => (isOpen && coarse ? setActive(null) : open(phrase))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (isOpen) setActive(null);
                            else open(phrase);
                          }
                        }}
                      >
                        {seg.text}
                      </span>
                    );
                  })}
                </h1>

                <div
                  className={`unfold${active ? " open" : ""}`}
                  onPointerEnter={coarse ? undefined : cancelClose}
                  onPointerLeave={coarse ? undefined : scheduleClose}
                >
                  <div className="unfold-inner">
                    <p className="unfold-text" aria-live="polite">
                      {PHRASE_REVEALS[shown]}
                    </p>
                  </div>
                </div>

                {copy!.sub && (
                  <p className="hero-sub" key={`${audience}-sub`}>
                    {copy!.sub}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="hero-id">
            <p className="hero-name">{NAME.toLowerCase()}</p>
            <p className="hero-role">Product Manager</p>
            <div className="hero-links">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${EMAIL}`}>Email</a>
              <a href={RESUME_URL} target="_blank" rel="noreferrer">
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
