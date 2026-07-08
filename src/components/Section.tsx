import type { CSSProperties, ReactNode } from "react";
import { useInViewOnce } from "../hooks";

interface SectionProps {
  id: string;
  kicker: string;
  title: string;
  lede?: string;
  children: ReactNode;
}

/** Shared section shell: kicker + serif title + one-shot staggered scroll reveal. */
export function Section({ id, kicker, title, lede, children }: SectionProps) {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  return (
    <section id={id} ref={ref} className={`section${inView ? " in" : ""}`}>
      <header className="section-head">
        <span className="kicker rv" style={{ "--i": 0 } as CSSProperties}>
          {kicker}
        </span>
        <h2 className="rv" style={{ "--i": 1 } as CSSProperties}>
          {title}
        </h2>
        {lede && (
          <p className="lede rv" style={{ "--i": 2 } as CSSProperties}>
            {lede}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

/** Helper for staggered children inside a Section. */
export function Rv({
  i,
  as: Tag = "div",
  className = "",
  children,
}: {
  i: number;
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`rv ${className}`.trim()} style={{ "--i": i } as CSSProperties}>
      {children}
    </Tag>
  );
}
