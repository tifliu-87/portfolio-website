import type { CSSProperties } from "react";
import { PROJECTS } from "../data";
import { useInViewOnce } from "../hooks";

export function Projects() {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  return (
    <section id="work" ref={ref} className={`work${inView ? " in" : ""}`}>
      <h2 className="work-title rv" style={{ "--i": 0 } as CSSProperties}>
        Recent work
      </h2>
      <div className="work-grid">
        {PROJECTS.map((project, i) => (
          <a
            key={project.id}
            href={`#/work/${project.id}`}
            className="work-card rv"
            style={{ "--i": i + 1, "--tint": project.tint } as CSSProperties}
          >
            <span className="work-cover" aria-hidden="true" />
            <span className="work-name">{project.title}</span>
            <span className="work-tagline">{project.tagline}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
