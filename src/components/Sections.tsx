import {
  ABOUT_PARAGRAPHS,
  EMAIL,
  INTERESTS,
  LINKEDIN_URL,
  NAME,
  RESUME_URL,
  TESTIMONIALS,
  TIMELINE,
  VALUES,
} from "../data";
import { Rv, Section } from "./Section";

export function Values() {
  return (
    <Section
      id="values"
      kicker="Values"
      title="How I think about product"
      lede="Principles I keep coming back to — the short version."
    >
      <ul className="values-list">
        {VALUES.map((v, i) => (
          <Rv as="li" key={v.statement} i={i + 2}>
            <h3>{v.statement}</h3>
            <p>{v.detail}</p>
          </Rv>
        ))}
      </ul>
    </Section>
  );
}

export function Background() {
  return (
    <Section
      id="background"
      kicker="Background"
      title="How I got here"
      lede="The trajectory, briefly. Full stories live in the case studies above."
    >
      <ol className="timeline">
        {TIMELINE.map((entry, i) => (
          <Rv as="li" key={entry.title} i={i + 2}>
            <span className="period">{entry.period}</span>
            <h3>{entry.title}</h3>
            <p>{entry.note}</p>
          </Rv>
        ))}
      </ol>
    </Section>
  );
}

export function Testimonials() {
  return (
    <Section
      id="references"
      kicker="References"
      title="Kind words from good people"
      lede="Placeholder quotes for now — real ones incoming."
    >
      <div className="quote-grid">
        {TESTIMONIALS.map((t, i) => (
          <Rv key={i} i={i + 2} className="quote-card-wrap">
            <figure className="quote-card">
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                {t.title}
              </figcaption>
            </figure>
          </Rv>
        ))}
      </div>
    </Section>
  );
}

export function About() {
  return (
    <Section
      id="about"
      kicker="About"
      title="Off the clock"
      lede="The person behind the roadmaps."
    >
      <div className="about-grid">
        <Rv i={2}>
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Rv>
        <Rv i={3}>
          <ul className="chips">
            {INTERESTS.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </Rv>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      kicker="Contact"
      title="Let's talk"
      lede=""
    >
      <div className="contact">
        <Rv i={2}>
          <p className="big-line">
            If any of this resonated, I&rsquo;d love to hear what you&rsquo;re working on.
          </p>
        </Rv>
        <Rv i={3}>
          <div className="contact-actions">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              Email me
            </a>
            <a className="btn btn-ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn btn-ghost" href={RESUME_URL} download>
              Resume (PDF)
            </a>
          </div>
        </Rv>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {NAME}
      </span>
      <span>Designed & built by hand. No trackers, no lag.</span>
    </footer>
  );
}
