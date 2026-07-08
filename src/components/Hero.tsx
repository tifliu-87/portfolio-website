import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  HERO_COPY,
  MACHINE_COPY,
  PHRASE_REVEALS,
  type AudienceId,
  type PhraseKey,
} from "../data";
import { useCoarsePointer } from "../hooks";

/**
 * Hero with hover-to-unfold phrases. Deliberately not a tooltip: the extra
 * line lives in the document flow beneath the sentence and unfolds via
 * grid-template-rows 0fr -> 1fr, gently pushing what follows.
 */
export function Hero({ audience }: { audience: AudienceId }) {
  const [active, setActive] = useState<PhraseKey | null>(null);
  // Remember the last phrase so its text stays visible while collapsing.
  const [shown, setShown] = useState<PhraseKey>("name");
  const closeTimer = useRef<number | undefined>(undefined);
  const coarse = useCoarsePointer();

  useEffect(() => {
    setActive(null);
    return () => window.clearTimeout(closeTimer.current);
  }, [audience]);

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

  if (audience === "machines") {
    return (
      <section id="intro" className="hero">
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
      </section>
    );
  }

  const copy = HERO_COPY[audience];

  return (
    <section id="intro" className="hero">
      <h1 className="hero-line" key={audience}>
        {copy.segments.map((seg, i) => {
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
          // A real <button> can't wrap across lines like text, so the phrase
          // is a span with button semantics — it must read as part of the
          // sentence, not a control sitting inside it.
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

      <p className="hero-sub" key={`${audience}-sub`}>
        {copy.sub}
      </p>
    </section>
  );
}
