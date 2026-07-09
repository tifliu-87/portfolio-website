import { useEffect, type CSSProperties } from "react";
import { NAME, type Project } from "../data";

export function ProjectPage({ project }: { project: Project }) {
  useEffect(() => {
    document.title = `${project.title}, ${NAME}`;
    return () => {
      document.title = `${NAME}, Product Manager`;
    };
  }, [project]);

  return (
    <article className="project-page">
      <a className="back-link" href="#/">
        ← All work
      </a>
      <h1>{project.title}</h1>
      <p className="pp-tagline">{project.tagline}</p>
      <div className="pp-cover" style={{ "--tint": project.tint } as CSSProperties} aria-hidden="true" />
      <dl className="pp-facts">
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
    </article>
  );
}
