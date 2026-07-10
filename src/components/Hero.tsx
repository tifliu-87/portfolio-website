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
 * name / role / contact links on the right), followed by one hidden line of
 * words sitting in the band between the hero and the work grid. Each word
 * rests at a whisper of opacity; as the cursor nears, a feathered falloff
 * raises its opacity and sharpness, and once found it settles to a quiet
 * steady presence for the rest of the visit. On touch or reduced-motion the
 * line is simply not rendered.
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

  // Feathered proximity reveal of the hidden words. Each word carries a
  // per-frame --near value (0..1) computed from its distance to the smoothed
  // cursor with a smoothstep falloff, so the reveal has a soft radial edge
  // without any lens geometry. Once a word has been mostly uncovered it is
  // marked .lit and keeps a low steady presence for the rest of the visit.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || coarse || reduced) return;
    const words = Array.from(section.querySelectorAll<HTMLElement>(".hero-word"));

    let raf = 0;
    let animating = false;
    let hasPointer = false;
    let pointerIn = false;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    type Spot = { el: HTMLElement; x: number; y: number; near: number; lit: boolean };
    let spots: Spot[] = [];

    const measure = () => {
      const sr = section.getBoundingClientRect();
      spots = words.map((el, i) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left - sr.left + r.width / 2,
          y: r.top - sr.top + r.height / 2,
          near: spots[i]?.near ?? 0,
          lit: spots[i]?.lit ?? false,
        };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    // Full reveal at the cursor, fading to nothing at REVEAL_RADIUS; a word
    // counts as found once it has been mostly uncovered. Sized so a couple
    // of neighboring words glow while the hovered one reads sharp.
    const REVEAL_RADIUS = 120;
    const FOUND_AT = 0.7;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      let busy = Math.hypot(target.x - cur.x, target.y - cur.y) > 0.3;
      for (const s of spots) {
        const d = Math.hypot(s.x - cur.x, s.y - cur.y);
        let t = pointerIn ? Math.max(0, 1 - d / REVEAL_RADIUS) : 0;
        t = t * t * (3 - 2 * t);
        s.near += (t - s.near) * 0.14;
        if (Math.abs(t - s.near) > 0.004) {
          busy = true;
        } else {
          s.near = t;
        }
        s.el.style.setProperty("--near", s.near.toFixed(3));
        if (!s.lit && s.near > FOUND_AT) {
          s.lit = true;
          s.el.classList.add("lit");
        }
      }
      if (busy) {
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

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!hasPointer) {
        hasPointer = true;
        cur.x = target.x;
        cur.y = target.y;
      }
      pointerIn = true;
      kick();
    };

    const onLeave = () => {
      pointerIn = false;
      kick();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
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
    <section id="intro" className="hero" ref={sectionRef}>
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

      {/* One hidden line in the band below the frame: words rest at a whisper
          of opacity until the cursor's feathered reveal finds them, after
          which they stay quietly present. */}
      {fieldOn && (
        <p className="hero-words" aria-hidden="true">
          {HIDDEN_WORDS.map((w, i) => (
            <span key={i} className="hero-word">
              {w}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
