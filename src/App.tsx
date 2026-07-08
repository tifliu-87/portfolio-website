import { useState } from "react";
import type { AudienceId } from "./data";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { RevealPanel } from "./components/RevealPanel";
import { About, Background, Contact, Footer, Testimonials, Values } from "./components/Sections";
import { NavRail } from "./components/NavRail";
import { ThemeSlider } from "./components/ThemeSlider";

export default function App() {
  const [audience, setAudience] = useState<AudienceId>("everyone");

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Header audience={audience} onAudienceChange={setAudience} />
      <div className="page">
        <main>
          <Hero audience={audience} />
          <Projects />
          <RevealPanel />
          <Values />
          <Background />
          <Testimonials />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
      <NavRail />
      <ThemeSlider />
    </>
  );
}
