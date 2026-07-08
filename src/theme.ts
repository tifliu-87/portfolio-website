/**
 * Theme engine.
 *
 * Six hand-tuned stops in the purple family. The slider produces a continuous
 * value in [0, 5]; we interpolate every color channel between adjacent stops
 * and write the result to CSS custom properties on <html>. Everything on the
 * page derives its color from those variables, so a single write re-themes
 * the whole site with zero React re-renders.
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
    id: "lavender",
    name: "Soft lavender",
    scheme: "light",
    bg: [265, 50, 95],
    surface: [265, 45, 91],
    ink: [268, 32, 16],
    inkMuted: [267, 14, 42],
    accent: [265, 58, 48],
    accentSoft: [265, 52, 87],
    accentInk: [265, 60, 97],
    line: [265, 26, 83],
  },
  {
    id: "mauve",
    name: "Dusty mauve",
    scheme: "light",
    bg: [330, 24, 92],
    surface: [330, 22, 88],
    ink: [330, 28, 17],
    inkMuted: [330, 12, 42],
    accent: [332, 42, 45],
    accentSoft: [330, 36, 85],
    accentInk: [330, 50, 97],
    line: [330, 18, 80],
  },
  {
    id: "heather",
    name: "Heather",
    scheme: "light",
    bg: [276, 28, 92],
    surface: [276, 26, 88],
    ink: [274, 34, 15],
    inkMuted: [274, 12, 40],
    accent: [272, 52, 46],
    accentSoft: [272, 45, 85],
    accentInk: [272, 60, 97],
    line: [274, 20, 80],
  },
  {
    id: "indigo",
    name: "Violet indigo",
    scheme: "dark",
    bg: [258, 30, 15],
    surface: [258, 28, 19],
    ink: [255, 40, 94],
    inkMuted: [256, 18, 72],
    accent: [254, 72, 76],
    accentSoft: [256, 34, 28],
    accentInk: [258, 40, 12],
    line: [257, 20, 28],
  },
  {
    id: "aubergine",
    name: "Aubergine",
    scheme: "dark",
    bg: [285, 26, 8],
    surface: [285, 24, 12],
    ink: [285, 24, 93],
    inkMuted: [285, 12, 68],
    accent: [288, 48, 74],
    accentSoft: [286, 28, 20],
    accentInk: [286, 30, 10],
    line: [285, 16, 21],
  },
  {
    id: "blush",
    name: "Plum blush",
    scheme: "light",
    bg: [344, 34, 93],
    surface: [342, 32, 89],
    ink: [336, 34, 16],
    inkMuted: [338, 14, 42],
    accent: [340, 46, 46],
    accentSoft: [341, 40, 86],
    accentInk: [341, 50, 97],
    line: [340, 22, 81],
  },
];

export const DEFAULT_THEME_INDEX = 2; // mid-tone purple on load
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
