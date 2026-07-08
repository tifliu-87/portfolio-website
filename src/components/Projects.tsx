import { useState, type CSSProperties, type MouseEvent } from "react";
import { PROJECT_GROUPS, type Project } from "../data";
import { Section } from "./Section";
import { useCoarsePointer, useInViewOnce } from "../hooks";

export function Projects() {
  return (
    <Section
      id="work"
      kicker="Work"
      title="Things I've helped build"
      lede="Every card below is a skeleton for a fuller case study — the shape of the work is here, the details are on their way."
    >
      {PROJECT_GROUPS.map((group) => (
        <ProjectGroupBlock key={group.id} groupId={group.id} />
      ))}
    </Section>
  );
}

function ProjectGroupBlock({ groupId }: { groupId: string }) {
  const group = PROJECT_GROUPS.find((g) => g.id === groupId)!;
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`project-group${inView ? " in" : ""}`}>
      <div className="group-head rv" style={{ "--i": 0 } as CSSProperties}>
        <h3>{group.title}</h3>
        <p>{group.blurb}</p>
      </div>
      <div className="project-grid">
        {group.projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const coarse = useCoarsePointer();

  // Subtle gradient parallax: writes two CSS vars on the card; the art layer
  // translates via transform only. Skipped entirely for touch devices.
  const onMouseMove = coarse
    ? undefined
    : (e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      };

  const onMouseLeave = coarse
    ? undefined
    : (e: MouseEvent<HTMLElement>) => {
        e.currentTarget.style.setProperty("--mx", "0");
        e.currentTarget.style.setProperty("--my", "0");
      };

  const artStyle = {
    "--ga": project.art.angle,
    "--gx": project.art.x,
    "--gy": project.art.y,
  } as CSSProperties;

  return (
    // The rv wrapper owns the scroll-reveal transition so it never fights the
    // card's own hover-lift transition.
    <div className="rv" style={{ "--i": index + 1 } as CSSProperties}>
    <article
      className={`project-card${open ? " open" : ""}`}
      style={artStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="project-card-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="cover" aria-hidden="true">
          <div className="cover-art" />
        </div>
        <div className="project-body">
          <div className="project-title-row">
            <h4>{project.title}</h4>
            <span className="project-toggle-glyph" aria-hidden="true">
              +
            </span>
          </div>
          <p className="tagline">{project.tagline}</p>
        </div>
      </button>
      <div className="project-details">
        <div className="project-details-inner">
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>{project.approach}</dd>
            </div>
            <div>
              <dt>Impact</dt>
              <dd>{project.impact}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
    </div>
  );
}
