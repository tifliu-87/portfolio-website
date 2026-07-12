import { useEffect, useMemo, useState } from "react";
import { EMAIL, LINKEDIN_URL, NAME, PROJECTS } from "./data";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { AiStack } from "./components/AiStack";
import { ProjectPage } from "./components/ProjectPage";
import { ThemeSlider } from "./components/ThemeSlider";
import { FontPicker } from "./components/FontPicker";
import { CursorField } from "./components/CursorField";

/** Tiny hash router; works on any static host with zero config. */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const project = useMemo(() => {
    const m = hash.match(/^#\/work\/([\w-]+)/);
    return m ? PROJECTS.find((p) => p.id === m[1]) : undefined;
  }, [hash]);

  return (
    <>
      <div className="page">
        <main>{project ? <ProjectPage project={project} /> : (
          <>
            <Hero />
            <Projects />
            <AiStack />
          </>
        )}</main>
        <footer className="site-footer">
          <span>
            © {new Date().getFullYear()} {NAME}
          </span>
          <span className="footer-links">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </span>
        </footer>
      </div>
      <ThemeSlider />
      <FontPicker />
      <CursorField />
    </>
  );
}
