import { useEffect, type CSSProperties } from "react";
import { EMAIL, NAME, type Project } from "../data";

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
      {project.tagline && <p className="pp-tagline">{project.tagline}</p>}
      <div className="pp-cover" style={{ "--tint": project.tint } as CSSProperties} aria-hidden="true" />
      {project.facts ? (
        <dl className="pp-facts">
          <div>
            <dt>Role</dt>
            <dd>{project.facts.role}</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>{project.facts.problem}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>{project.facts.approach}</dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>{project.facts.impact}</dd>
          </div>
        </dl>
      ) : (
        <p className="pp-pending">
          This case study is still being written.{" "}
          <a href={`mailto:${EMAIL}`}>Email me</a> and I'll gladly walk you
          through it in the meantime.
        </p>
      )}
    </article>
  );
}
