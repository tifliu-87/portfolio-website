---
name: PM Portfolio
description: Confident PM portfolio—rose-to-plum themes, serif display, thoughtful interactions
colors:
  cream-bg: "#f9f1f3"
  surface: "#f3e9ed"
  ink-dark: "#3a1b28"
  ink-muted: "#666564"
  accent-rose: "#b8497a"
  accent-soft: "#f0dce5"
  accent-light: "#fdf5f9"
  line-subtle: "#e0cad5"
typography:
  display:
    fontFamily: '"Fraunces Variable", "Iowan Old Style", Georgia, serif'
    fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.005em"
    fontVariation: '"opsz" 144'
  headline:
    fontFamily: '"Fraunces Variable", "Iowan Old Style", Georgia, serif'
    fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: '"Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: '"Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: 'ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace'
    fontSize: "clamp(0.68rem, 1.3vw, 0.78rem)"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "4px"
  md: "12px"
  lg: "16px"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "3rem"
components:
  button-plain-text:
    textColor: "{colors.ink-muted}"
    fontSize: "0.78rem"
  button-plain-text-hover:
    textColor: "{colors.accent-rose}"
  button-plain-text-active:
    textColor: "{colors.accent-rose}"
  tab-plain:
    textColor: "{colors.ink-muted}"
    fontSize: "0.78rem"
  tab-plain-active:
    textColor: "{colors.accent-rose}"
  link-text:
    textColor: "{colors.ink-muted}"
  link-text-hover:
    textColor: "{colors.accent-rose}"
  card-work:
    backgroundColor: "{colors.cream-bg}"
    rounded: "{rounded.md}"
    padding: "0"
  card-work-cover:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    height: "160px"
---

# Design System: PM Portfolio

## 1. Overview

**Creative North Star: "The Thoughtful Maker"**

This is the workspace of someone meticulous—where every detail is intentional and nothing is accidental. The design is a quiet collaborator: typography and color carry the narrative, motion is purposeful, and components are clean without chrome. The portfolio speaks through the work itself, not through decoration or showiness.

Playfulness lives in the interactions, not the surface. Hover states, hidden reveals, and a theme system that invites exploration make the experience feel alive—but always in service of clarity, never at its expense. The rose-to-plum color progression is the one indulgence; it's the aesthetic anchor that rewards curiosity.

Explicitly rejects: slick corporate formality, trendy or flashy design, vague process-focused storytelling, and the generic PM advice aesthetic.

**Key Characteristics:**
- **Serif display + sans body:** Typography hierarchy is clear and elegant; serif conveys authority and craft.
- **Purple progression:** Six carefully hand-tuned stops from rose through lavender to dark plum; the theme slider invites theme-hopping without jarring.
- **Restrained + responsive:** Components look clean at rest; interactions are subtle but present, rewarding attention.
- **Motion with intention:** One easing curve everywhere; three durations for different scales. Reduced-motion respected—opacity crossfades, not skipped.
- **Playful details:** Hidden words with a feathered cursor reveal, hover reveals, delightful surprises that don't distract from the content.
- **Color as navigation:** Accent color highlights interactive elements and draws focus to what matters.

## 2. Colors

A six-stop interpolation from rose through lavender to plum, with carefully tuned light and dark modes. The default is Rose: a cream background with a subtle pink tint, paired with rose accents. Visitors can shift through the full spectrum via the theme slider.

### Primary

- **Accent Rose** (#b8497a): The anchor color for the Rose theme (default). Used on hover states, active tabs, accent text, and CTAs. Rare enough to matter; present enough to guide.
- **Accent Soft** (#f0dce5): The light tint of rose; blooms behind interactive phrases on hover. Creates a gentle wash without harsh contrast.

### Neutral

- **Cream BG** (#f9f1f3): The default background; cream with a subtle pink tint so the rose theme feels cohesive rather than tinted.
- **Surface** (#f3e9ed): Slightly darker surface for cards, covers, and layered elements. Creates gentle depth without requiring shadows.
- **Ink Dark** (#3a1b28): Body text and strong contrast. Meets 4.5:1 WCAG AA against the cream.
- **Ink Muted** (#666564): Secondary copy, labels, helper text. Still meets 4.5:1 WCAG AA; reads as confidence, not timidity.
- **Line Subtle** (#e0cad5): Borders, dividers, the footer line. Present but quiet.

### Named Rules

**The One Accent Rule.** The primary accent appears on ≤10% of any screen. Its rarity is the point. Overuse drains it of power. When the user switches themes, the accent interpolates smoothly; the Cream BG adjusts to match the hue family so the new theme feels like it belongs, not like a costume change.

**The Theme Interpolation Rule.** All colors interpolate between theme stops via the theme engine (theme.ts). The frontend writes resolved theme values to CSS custom properties at runtime; nothing is baked. This means one component can be rendered in any theme without conditional code.

## 3. Typography

**Display Font:** Fraunces Variable (weight 600, with optical size axis tuned to 144 for headlines)  
**Body Font:** Inter Variable  
**Mono Font:** System monospace (Cascadia Code, SF Mono, Menlo, Consolas)

**Character:** Serif display conveys craft and authority; sans body is warm and legible. The pairing feels editorial without being stuffy. The display font's optical sizing makes large headlines feel confident, while smaller headlines stay crisp. Fraunces' generous proportions and high x-height give text presence even at small scales.

### Hierarchy

- **Display** (Fraunces 600, clamp(1.05rem, 1.6vw, 1.35rem), line-height 1.15): Hero name, primary identity. High-impact introduction. Scales with viewport so it feels right from mobile to desktop.
- **Headline** (Fraunces 600, clamp(1.2rem, 2.2vw, 1.7rem), line-height 1.3): Section titles, case study names. Readable at a glance; text-wrap: balance ensures even line lengths.
- **Title** (Fraunces 600, 0.95rem, line-height 1): Card titles, project names. Smaller but still commanding.
- **Body** (Inter, 0.9rem, line-height 1.6): All running text. Max width 30–34ch to keep line length comfortable. Muted gray for secondary copy.
- **Label** (Inter, 0.78rem, line-height 1.5): Tabs, form labels, footer text. Uppercase when needed (case study facts).
- **Mono** (System, clamp(0.68rem, 1.3vw, 0.78rem), line-height 1.7): Hidden words in the hero; machines tab; code snippets. Quiet, precise.

### Named Rules

**The Weight Consistency Rule.** Serif faces use weight 600 (Fraunces). Sans and mono remain at their default (Inter 400). No weight mixing within a family.

**The Baseline Rule.** All text aligns to a shared baseline grid (line-height 1.6 on body, 1.15 on display). This creates invisible scaffolding.

**The No-Overflow Rule.** Headings with large clamp() max values must be tested at every breakpoint. If text overflows its container, reduce the clamp max or rewrite the copy. The viewport is part of the design.

## 4. Elevation

This system uses **tonal layering, not shadows.** Depth is conveyed through color (surface is slightly darker than background), not blur. The one exception: the theme slider's handle carries a subtle box-shadow (0 1px 6px rgba(0 0 0 / 0.25)) for haptic feedback.

Flat-by-default keeps the portfolio calm and readable. Tonal shifts (background to surface) are gentle; they suggest layering without drama. On hover, cards lift subtly (transform: translateY(-4px)) to signal interactivity—motion, not shadows, creates the sense of elevation.

### Named Rules

**The Flat-By-Default Rule.** No drop shadows on elements. Depth comes from tonal shifts and motion, not blur. The goal is clarity; shadow vocabulary clutters the interface.

**The Hover-Lift Rule.** Interactive elements (cards, phrases) respond to hover with a subtle translateY lift plus a color shift. No box-shadow; motion + color = feedback.

## 5. Components

### Links & Buttons

**Style:** Plain text, no chrome. Color (ink-muted) by default, accent-rose on hover. Small caps or uppercase (via letter-spacing) for form labels only.

- **Hover / Focus:** Instant color transition (var(--dur-micro), ~200ms) to accent-rose. Text-decoration: none; the color shift is the affordance. Focus ring is 2px solid accent, 3px offset, 4px radius.
- **Plain Text Tabs:** Horizontal flex, no pill background. Active tab is simply accent-colored. Hovers shift color instantly.
- **Back Link:** Small label-weight text, muted by default, accent on hover. Precedes project pages.

### Cards

**Work Card**
- **Cover:** 16/10 aspect ratio, 12px radius. Background is a tinted blend of accent + surface (using color-mix in oklab with a --tint CSS var for theme-specific saturation). On hover: translateY(-4px) lift (var(--dur-small), ~420ms).
- **Title:** Display weight, 0.95rem, inherit color but shift to accent on parent card hover.
- **Tagline:** Muted gray, 0.78rem, line-height 1.5. Stays muted even on card hover.

**Project Page Cover**
- **Size:** 16/8 aspect ratio, 16px radius. Same tinted blend as work cards. Transitions background on theme shift (var(--dur-large), ~750ms).

**In-Progress Case Studies**
- **Grid:** Projects without a tagline never render as near-empty cards; they collapse into one quiet sentence of links under the grid ("Case studies in progress: ..."), label size, muted, underlined in the line color.
- **Page:** Absent facts render a single honest sentence with an accent email link (the site's primary CTA) instead of repeated placeholder text.

### Interactive Elements

**Phrase (Hover Reveal)**
- **Style:** Display-weight text, accent-colored. Rounded pill background (0.22em radius, 0.08em padding). Background is transparent by default.
- **Hover / Active:** Background blooms to accent-soft (color-mix(in oklab, var(--accent-soft) 75%, transparent); ~200ms). On hover or when .on class is present.
- **Unfold (Grid Expansion):** Nested grid-template-rows 0fr → 1fr transition (~420ms). Text inside fades in with opacity + translateY simultaneously.

**Hidden Words (Hero Line)**
- **Placement:** One centered line ("good products aren't built, they're noticed") in the band between the hero frame and the work grid. Mono, 0.78rem, ink-colored. At rest a whisper: opacity 0.05, blur 3px.
- **Feathered Reveal:** Each word carries a per-frame `--near` value (0..1) computed in JS from its distance to the smoothed cursor, with a smoothstep falloff to ~120px. Opacity rises to 0.9 and blur falls to 0 as the cursor nears, so sweeping the line reads as wiping it clear. No lens geometry, no backdrop-filter, no color inversion; ink, opacity, and blur are the only materials.
- **Found State (.lit):** Once mostly uncovered a word settles to a steady opacity 0.35, sharp, for the rest of the session, still brightening when the cursor revisits.
- **Degradation:** The line is not rendered on coarse pointers or under prefers-reduced-motion.

### Theme Controls

**Slider (Fixed Right)**
- **Rail:** 7px wide, 260px tall, linear gradient from rose accent through all theme colors. Opacity 0.9. Tiny radial handle (1.5rem diameter) with 3px border. Box-shadow for depth; the handle scales to 1.12 while dragging.
- **Ticks:** Six small dots along the rail, one per theme stop. On hover, the inner dot scales 1.6x. Touch: grab/grabbing cursors.
- **Live Label:** The vertical "shade" label above the rail reads the nearest stop's name (lowercase) while the theme is moving, then settles back to "shade" ~1.2s after it stops. Anchored above the track so name length never nudges the rail.

**Mobile Swatches (Fixed Bottom-Right)**
- **Container:** Rounded pill (border-radius 999px), semi-transparent surface background (90% opaque), thin line border. 0.5rem gap between swatch buttons.
- **Swatch Buttons:** 1.25rem circles, 2px transparent border by default. Active swatch: ink-colored border + scale 1.15. Transition ~200ms.

**Font Picker (Fixed Bottom-Left)**
- **Style:** Compact vertical stack, rounded 14px, semi-transparent background, line border. Buttons are small label text (0.85rem), muted by default, accent when active.
- **Interaction:** Color transition ~200ms on hover/active. No background pill; color is the affordance.

## 6. Do's and Don'ts

### Do

- **Do** use Fraunces 600 for all headlines and display text. It conveys craft and authority.
- **Do** keep accent color to ≤10% of any screen. Its rarity makes it powerful.
- **Do** use muted gray for secondary copy; it reads as confident, not timid. Ensure 4.5:1 contrast against backgrounds.
- **Do** animate via opacity and transform only (translate, scale, rotate). Never animate layout properties (width, height, padding).
- **Do** respect reduced-motion: provide opacity-only crossfades as the alternative to transforms.
- **Do** use one easing curve everywhere: cubic-bezier(0.16, 1, 0.3, 1). No bounce, no elastic.
- **Do** use three duration tiers: micro (200ms) for state changes, small (420ms) for inline expansions, large (750ms) for section transitions.
- **Do** test all clamp() values at every breakpoint to catch heading overflow.
- **Do** let the work speak. Components should be invisible; the content should shine.
- **Do** provide hover feedback on interactive elements. Subtle, never gratuitous.

### Don't

- **Don't** use shadows for depth. Tonal shifts and motion convey elevation.
- **Don't** add motion for motion's sake. If there's no meaning to the motion, remove it.
- **Don't** use bright, neon, or saturated accent colors. Rose, lavender, and plum are muted intentionally.
- **Don't** introduce new serif or sans families. Stick to Fraunces (display) and Inter (body).
- **Don't** use side-stripe borders (border-left / border-right > 1px as colored accents). Never intentional in this system.
- **Don't** create gradient text (background-clip: text). It's decorative and reduces readability.
- **Don't** use nested cards. Tonal shifts are enough; stacked chrome clutters the page.
- **Don't** render interactive elements with no hover state. Every clickable thing should respond.
- **Don't** let the design compete with the work. The portfolio is about outcomes, not visual effects.
- **Don't** feel pressured to fill silence with decoration. Whitespace is a design tool here.
- **Don't** vague or hide the actual outcomes. Show impact directly: scale, metrics, user outcomes.
