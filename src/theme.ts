/**
 * Theme engine.
 *
 * Six hand-tuned stops from rose through lavender to dark plum. The slider
 * produces a continuous value in [0, 5]; we interpolate every color channel
 * between adjacent stops and write the result to CSS custom properties on
 * <html>. Everything on the page derives its color from those variables, so a
 * single write re-themes the whole site with zero React re-renders.
 *
 * Light-mode backgrounds stay essentially white (L 99%) with a whisper of the
 * active hue, so the page reads clean and professional rather than tinted.
 */

export type Hsl = readonly [h: number, s: number, l: number];

export interface ThemeStop {
  id: string;
  name: string;
  scheme: "light" | "dark";
  bg: Hsl;
  surface: Hsl;
  ink: Hsl;
  inkMuted: Hsl;
  accent: Hsl;
  accentSoft: Hsl;
  accentInk: Hsl;
  line: Hsl;
}

export const THEME_STOPS: ThemeStop[] = [
  {
    id: "rose",
    name: "Rose",
    scheme: "light",
    bg: [347, 30, 99],
    surface: [345, 22, 95],
    ink: [340, 30, 16],
    inkMuted: [340, 10, 40],
    accent: [343, 42, 46],
    accentSoft: [343, 35, 88],
    accentInk: [343, 50, 97],
    line: [343, 18, 84],
  },
  {
    id: "mauve",
    name: "Dusty mauve",
    scheme: "light",
    bg: [325, 22, 99],
    surface: [325, 17, 95],
    ink: [325, 26, 16],
    inkMuted: [325, 10, 40],
    accent: [327, 34, 48],
    accentSoft: [326, 30, 88],
    accentInk: [326, 45, 97],
    line: [326, 15, 84],
  },
  {
    id: "lavender",
    name: "Soft lavender",
    scheme: "light",
    bg: [268, 20, 99],
    surface: [268, 16, 95],
    ink: [268, 26, 16],
    inkMuted: [267, 10, 42],
    accent: [266, 36, 54],
    accentSoft: [266, 32, 89],
    accentInk: [266, 45, 97],
    line: [266, 14, 85],
  },
  {
    id: "heather",
    name: "Heather",
    scheme: "light",
    bg: [285, 16, 99],
    surface: [285, 13, 95],
    ink: [282, 24, 16],
    inkMuted: [282, 9, 42],
    accent: [283, 28, 50],
    accentSoft: [283, 26, 88],
    accentInk: [283, 40, 97],
    line: [283, 12, 84],
  },
  {
    id: "dusk",
    name: "Lavender dusk",
    scheme: "dark",
    bg: [262, 22, 14],
    surface: [262, 20, 18],
    ink: [260, 30, 93],
    inkMuted: [260, 14, 70],
    accent: [263, 45, 78],
    accentSoft: [262, 26, 27],
    accentInk: [262, 30, 12],
    line: [261, 16, 26],
  },
  {
    id: "plum",
    name: "Dark plum",
    scheme: "dark",
    bg: [335, 24, 10],
    surface: [335, 22, 14],
    ink: [335, 22, 93],
    inkMuted: [335, 11, 68],
    accent: [338, 45, 74],
    accentSoft: [336, 26, 22],
    accentInk: [336, 28, 10],
    line: [336, 15, 22],
  },
];

export const DEFAULT_THEME_INDEX = 0; // rose on load
export const MAX_THEME_VALUE = THEME_STOPS.length - 1;

const TOKEN_KEYS = [
  "bg",
  "surface",
  "ink",
  "inkMuted",
  "accent",
  "accentSoft",
  "accentInk",
  "line",
] as const;

type TokenKey = (typeof TOKEN_KEYS)[number];

const CSS_VAR: Record<TokenKey, string> = {
  bg: "--bg",
  surface: "--surface",
  ink: "--ink",
  inkMuted: "--ink-muted",
  accent: "--accent",
  accentSoft: "--accent-soft",
  accentInk: "--accent-ink",
  line: "--line",
};

export interface ResolvedTheme {
  value: number;
  scheme: "light" | "dark";
  css: Record<TokenKey, string>;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Interpolate hue along the shortest arc so purple never detours through green. */
function lerpHue(a: number, b: number, t: number): number {
  const d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
}

function lerpHsl(a: Hsl, b: Hsl, t: number): Hsl {
  return [lerpHue(a[0], b[0], t), a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function hslToCss([h, s, l]: Hsl): string {
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

export function resolveTheme(value: number): ResolvedTheme {
  const v = clamp(value, 0, MAX_THEME_VALUE);
  const i = Math.min(Math.floor(v), MAX_THEME_VALUE - 1);
  const t = v - i;
  const a = THEME_STOPS[i];
  const b = THEME_STOPS[i + 1];
  const css = {} as Record<TokenKey, string>;
  for (const key of TOKEN_KEYS) {
    css[key] = hslToCss(lerpHsl(a[key], b[key], t));
  }
  return { value: v, scheme: t < 0.5 ? a.scheme : b.scheme, css };
}

type Listener = (theme: ResolvedTheme) => void;

let currentValue = DEFAULT_THEME_INDEX;
let currentTheme = resolveTheme(currentValue);
const listeners = new Set<Listener>();

export function getThemeValue(): number {
  return currentValue;
}

export function getResolvedTheme(): ResolvedTheme {
  return currentTheme;
}

export function setThemeValue(value: number): void {
  currentValue = clamp(value, 0, MAX_THEME_VALUE);
  currentTheme = resolveTheme(currentValue);
  const root = document.documentElement;
  for (const key of TOKEN_KEYS) {
    root.style.setProperty(CSS_VAR[key], currentTheme.css[key]);
  }
  root.style.colorScheme = currentTheme.scheme;
  for (const fn of listeners) fn(currentTheme);
}

export function subscribeTheme(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initTheme(): void {
  setThemeValue(DEFAULT_THEME_INDEX);
}
