/**
 * TESTING ONLY: font candidates for the display face, switchable at runtime
 * like the theme slider. To remove this feature later: delete this file,
 * the FontPicker component, and the extra @fontsource imports in main.tsx,
 * then keep whichever family won in global.css.
 */

const INTER = '"Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif';

export interface FontOption {
  id: string;
  label: string;
  /** Headline / display face */
  display: string;
  displayWeight: string;
  tracking: string;
  /** Body face (usually Inter; sans-led options can take over the body too) */
  body: string;
  /** Extra variable-font axes, e.g. forcing Fraunces' display optical size. */
  variation?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // First option is the site default; global.css :root defaults must match.
  {
    id: "fraunces",
    label: "Fraunces (default)",
    display: '"Fraunces Variable", Georgia, serif',
    displayWeight: "560",
    tracking: "-0.01em",
    body: INTER,
  },
  {
    id: "fraunces-display",
    label: "Fraunces Display",
    display: '"Fraunces Variable", Georgia, serif',
    displayWeight: "600",
    tracking: "-0.005em",
    body: INTER,
    variation: '"opsz" 144',
  },
  {
    id: "newsreader",
    label: "Newsreader",
    display: '"Newsreader Variable", Georgia, serif',
    displayWeight: "470",
    tracking: "-0.005em",
    body: INTER,
  },
  {
    id: "instrument",
    label: "Instrument Serif",
    display: '"Instrument Serif", Georgia, serif',
    displayWeight: "400",
    tracking: "0em",
    body: INTER,
  },
  {
    id: "space",
    label: "Space Grotesk",
    display: '"Space Grotesk Variable", system-ui, sans-serif',
    displayWeight: "480",
    tracking: "-0.02em",
    body: INTER,
  },
  {
    id: "outfit",
    label: "Outfit (light)",
    display: '"Outfit Variable", system-ui, sans-serif',
    displayWeight: "300",
    tracking: "-0.005em",
    body: '"Outfit Variable", system-ui, sans-serif',
  },
];

export function applyFont(option: FontOption): void {
  const root = document.documentElement;
  root.style.setProperty("--font-display", option.display);
  root.style.setProperty("--display-weight", option.displayWeight);
  root.style.setProperty("--display-tracking", option.tracking);
  root.style.setProperty("--display-variation", option.variation ?? "normal");
  root.style.setProperty("--font-sans", option.body);
  // The hero locks its word boxes to widths measured in the current display
  // face; let it re-measure under the new one.
  window.dispatchEvent(new Event("fontchange"));
}
