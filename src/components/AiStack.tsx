import type { CSSProperties } from "react";
import { AI_LEDE, AI_STACK } from "../data";
import { useInViewOnce } from "../hooks";

/**
 * "Fluent in AI": a quiet spec-sheet of the AI tools in daily rotation,
 * grouped by what they're used for. Reads like the machines tab's cousin:
 * plain rows, no cards, the labels doing the organizing.
 */
export function AiStack() {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  return (
    <section id="ai" ref={ref} className={`ai${inView ? " in" : ""}`}>
      <h2 className="work-title rv" style={{ "--i": 0 } as CSSProperties}>
        Fluent in AI
      </h2>
      <p className="ai-lede rv" style={{ "--i": 1 } as CSSProperties}>
        {AI_LEDE}
      </p>
      <dl className="ai-rows">
        {AI_STACK.map((row, i) => (
          <div key={row.label} className="rv" style={{ "--i": i + 2 } as CSSProperties}>
            <dt>{row.label}</dt>
            <dd>{row.tools.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
