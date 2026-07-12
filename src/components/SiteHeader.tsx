import { useEffect, useState, type MouseEvent } from "react";
import { EMAIL, NAME, RESUME_URL } from "../data";

/** Scroll depth (px) past which the header slides in. */
const SHOW_AT = 320;

/**
 * Site header: absent while the hero is on screen, sliding in once the
 * visitor scrolls past it. Name on the left returns home; quiet section and
 * contact links on the right. While hidden the header is inert so its links
 * never catch keyboard focus.
 */

/** Smooth-scrolls to a section, waiting out a route change if it must mount first. */
function scrollToId(id: string, tries = 12) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else if (tries > 0) requestAnimationFrame(() => scrollToId(id, tries - 1));
}

export function SiteHeader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > SHOW_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Works from a project page too: writing the hash routes home, and the
  // retry loop scrolls once the section has mounted.
  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    window.location.hash = `#${id}`;
    scrollToId(id);
  };

  const goHome = (e: MouseEvent) => {
    e.preventDefault();
    if (window.location.hash.startsWith("#/")) {
      window.location.hash = "#/"; // the router resets scroll on route changes
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={`site-header${show ? " show" : ""}`} inert={!show}>
      <div className="sh-inner">
        <a className="sh-name" href="#intro" onClick={goHome}>
          {NAME.toLowerCase()}
        </a>
        <nav className="sh-nav" aria-label="Site">
          <a href="#work" onClick={jump("work")}>
            Work
          </a>
          <a className="sh-ai" href="#ai" onClick={jump("ai")}>
            Fluent in AI
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a href={`mailto:${EMAIL}`}>Email</a>
        </nav>
      </div>
    </header>
  );
}
