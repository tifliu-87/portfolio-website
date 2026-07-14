import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { EMAIL, LINKEDIN_URL, NAME, PROJECTS } from "./data";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { AiStack } from "./components/AiStack";
import { ProjectPage } from "./components/ProjectPage";
import { ThemeSlider } from "./components/ThemeSlider";
import { FontPicker } from "./components/FontPicker";
import { CursorField } from "./components/CursorField";
import { SiteHeader } from "./components/SiteHeader";

// The chat drawer loads lazily on first open, keeping it (and its knowledge
// base) out of the initial bundle; it stays mounted afterwards so closing
// never discards the conversation.
const ChatDrawer = lazy(() => import("./components/chat/ChatDrawer"));

/** Tiny hash router; works on any static host with zero config. */
function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      // Route changes (#/...) start at the top; in-page anchors like #work
      // keep the browser's native scroll so the header can jump to sections.
      if (window.location.hash.startsWith("#/")) window.scrollTo(0, 0);
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

  // The drawer mounts on first open and stays mounted (chatMounted never
  // flips back), so reopening restores the conversation where it left off.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const openChat = useCallback(() => {
    setChatMounted(true);
    setChatOpen(true);
  }, []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  return (
    <>
      <SiteHeader onOpenChat={openChat} />
      <div className="page">
        <main>{project ? <ProjectPage project={project} /> : (
          <>
            <Hero onOpenChat={openChat} />
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
      {chatMounted && (
        <Suspense fallback={null}>
          <ChatDrawer open={chatOpen} onClose={closeChat} />
        </Suspense>
      )}
    </>
  );
}
