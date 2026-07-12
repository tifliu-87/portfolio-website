import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AUDIENCES,
  EMAIL,
  GITHUB_URL,
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
 *
 * The headline and name are also split into per-letter spans (.wk): letters
 * near the cursor lean into Fraunces' SOFT and WONK variable axes and ease
 * back as it moves away, driven by the same proximity loop as the words.
 */

/**
 * Splits text into per-letter spans for the proximity wonk effect. Words are
 * wrapped in white-space:nowrap spans so lines still break only at spaces;
 * the space runs themselves are re-emitted verbatim as text nodes.
 */
function Wonky({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s/.test(part) ? (
          part
        ) : part ? (
          <span key={i} className="wonk-w">
            {Array.from(part).map((ch, j) => (
              <span key={j} className="wk">
                {ch}
              </span>
            ))}
          </span>
        ) : null,
      )}
    </>
  );
}

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

  // Feathered proximity field for the hidden words and the wonky letters.
  // Words carry a per-frame --near value (0..1) computed from distance to the
  // smoothed cursor with a smoothstep falloff; once mostly uncovered they are
  // marked .lit and keep a low steady presence. Letters (.wk) use the same
  // falloff over a tighter radius to swell toward Fraunces' display optical
  // size and lean into its SOFT/WONK axes (whose deltas only act at display
  // opsz), easing back to upright as the cursor moves on. Since opsz changes
  // advance widths, every word box (.wonk-w) is locked to its resting width
  // so the morph can never re-wrap a line: letters squirm inside their word.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || coarse || reduced) return;
    const words = Array.from(section.querySelectorAll<HTMLElement>(".hero-word"));
    const letters = Array.from(section.querySelectorAll<HTMLElement>(".wk"));
    const boxes = Array.from(section.querySelectorAll<HTMLElement>(".wonk-w"));

    let raf = 0;
    let animating = false;
    let hasPointer = false;
    let pointerIn = false;
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    type Spot = {
      el: HTMLElement;
      word: boolean;
      x: number;
      y: number;
      /** Resting px font-size, used as the letter's resting opsz. */
      size: number;
      near: number;
      prev: number;
      lit: boolean;
    };
    let spots: Spot[] = [];

    const measure = () => {
      const sr = section.getBoundingClientRect();
      spots = [...words, ...letters].map((el, i) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          word: i < words.length,
          x: r.left - sr.left + r.width / 2,
          y: r.top - sr.top + r.height / 2,
          size: i < words.length ? 0 : parseFloat(getComputedStyle(el).fontSize),
          near: spots[i]?.near ?? 0,
          prev: spots[i]?.prev ?? -1,
          lit: spots[i]?.lit ?? false,
        };
      });
    };

    // Freeze each word box at its natural width, measured with every letter
    // at rest. Marking prev dirty makes the next tick re-write in-flight
    // letters that the reset below momentarily straightened.
    const lockWidths = () => {
      for (const el of letters) el.style.fontVariationSettings = "";
      for (const box of boxes) box.style.width = "";
      const natural = boxes.map((box) => box.getBoundingClientRect().width);
      boxes.forEach((box, i) => {
        box.style.width = `${natural[i].toFixed(2)}px`;
      });
      for (const s of spots) if (!s.word) s.prev = -1;
    };

    lockWidths();
    measure();
    // Glyph metrics shift once the webfonts land; re-measure so widths and
    // letter centers aren't stuck at fallback-font values. Same when the
    // font tester swaps the display face.
    const relock = () => {
      lockWidths();
      measure();
    };
    document.fonts?.ready.then(relock);
    window.addEventListener("fontchange", relock);
    let lastWidth = section.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      // Width locks are only invalidated by horizontal resizes (the clamp()
      // type scale); height-only changes like the unfold just re-measure.
      const w = section.getBoundingClientRect().width;
      if (w !== lastWidth) {
        lastWidth = w;
        lockWidths();
      }
      measure();
    });
    ro.observe(section);

    // Words: full reveal at the cursor, fading to nothing at REVEAL_RADIUS;
    // found once mostly uncovered. Generous so the words start glowing while
    // the cursor is still a fair distance away and first-time visitors can't
    // miss them. Letters: a tighter radius so only the word or two under the
    // cursor goes wonky.
    const REVEAL_RADIUS = 200;
    const WONK_RADIUS = 90;
    const FOUND_AT = 0.7;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      let busy = Math.hypot(target.x - cur.x, target.y - cur.y) > 0.3;
      for (const s of spots) {
        const d = Math.hypot(s.x - cur.x, s.y - cur.y);
        let t = pointerIn ? Math.max(0, 1 - d / (s.word ? REVEAL_RADIUS : WONK_RADIUS)) : 0;
        t = t * t * (3 - 2 * t);
        s.near += (t - s.near) * (s.word ? 0.14 : 0.2);
        if (Math.abs(t - s.near) > 0.004) {
          busy = true;
        } else {
          s.near = t;
        }
        if (s.near === s.prev) continue;
        s.prev = s.near;
        if (s.word) {
          s.el.style.setProperty("--near", s.near.toFixed(3));
          if (!s.lit && s.near > FOUND_AT) {
            s.lit = true;
            s.el.classList.add("lit");
          }
        } else if (s.near === 0) {
          // Fully at rest: drop the override so auto optical sizing returns.
          s.el.style.fontVariationSettings = "";
        } else {
          const opsz = s.size + (Math.min(120, s.size * 3.5) - s.size) * s.near;
          s.el.style.fontVariationSettings = `"opsz" ${opsz.toFixed(1)}, "SOFT" ${(s.near * 50).toFixed(1)}, "WONK" ${s.near.toFixed(3)}`;
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
      window.removeEventListener("fontchange", relock);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // audience: the headline is keyed by it, so its letter spans are new DOM
    // nodes after every tab switch and must be re-queried.
  }, [coarse, reduced, audience]);

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
                          <Wonky text={seg.text} />
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
                        aria-label={seg.text}
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
                        <Wonky text={seg.text} />
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
            {/* Icon row above the name: hidden until the name is hovered or
                focused, always visible on touch. The row keeps its height at
                rest so the reveal never shifts the layout, and the name stays
                flush with the right edge of the block. */}
            <div className="hero-name-block">
              <div className="id-icons">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${NAME} on GitHub`}
                  style={{ "--i": 0 } as CSSProperties}
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${NAME} on LinkedIn`}
                  style={{ "--i": 1 } as CSSProperties}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  aria-label={`Email ${NAME}`}
                  style={{ "--i": 2 } as CSSProperties}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                  </svg>
                </a>
              </div>
              <p className="hero-name">
                <Wonky text={NAME.toLowerCase()} />
              </p>
            </div>
            <p className="hero-role">product manager · builder</p>
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
