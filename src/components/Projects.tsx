import type { CSSProperties } from "react";
import { PROJECTS } from "../data";
import { useInViewOnce } from "../hooks";

export function Projects() {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  // Projects without a tagline are still being written up: they get a quiet
  // one-line mention under the grid instead of a near-empty card.
  const featured = PROJECTS.filter((p) => p.tagline);
  const upcoming = PROJECTS.filter((p) => !p.tagline);
  return (
    <section id="work" ref={ref} className={`work${inView ? " in" : ""}`}>
      <h2 className="work-title rv" style={{ "--i": 0 } as CSSProperties}>
        Recent work
      </h2>
      <div className="work-grid">
        {featured.map((project, i) => (
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
      {upcoming.length > 0 && (
        <p className="work-more rv" style={{ "--i": featured.length + 1 } as CSSProperties}>
          Case studies in progress:{" "}
          {upcoming.map((project, i) => (
            <span key={project.id}>
              <a href={`#/work/${project.id}`}>{project.title}</a>
              {i < upcoming.length - 2 ? ", " : i === upcoming.length - 2 ? ", and " : "."}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
