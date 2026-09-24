# UI Styles Catalog

Load this file when the user requests a specific visual style, asks what style fits their product, or when you need to select a visual direction beyond the 5 baseline directions in `references/visual-directions.md`.

Each entry includes: description, best-fit industries, key tokens, required effects, forbidden patterns, and accessibility notes.

---

## How to Use

1. Match the user's product and emotional goal to a style.
2. Read the style's token overrides and apply them on top of the selected visual direction baseline.
3. Apply required effects — these are mandatory for the style to read correctly.
4. Enforce forbidden patterns — violating them breaks the style's identity.

---

## Style Index

| # | Style Name | Mood | Best For |
|---|-----------|------|----------|
| 1 | Minimal Clean | Clear, quiet | SaaS, productivity, B2B |
| 2 | Glassmorphism | Layered, translucent | Dashboard, mobile, AI products |
| 3 | Liquid Glass | Fluid, premium | Apple-adjacent, premium apps |
| 4 | Neumorphism | Soft, tactile | IoT, audio apps, settings |
| 5 | Claymorphism | Playful, bubbly | Consumer apps, onboarding |
| 6 | Brutalism | Raw, loud | Portfolio, fashion, culture |
| 7 | Data Brutalism | Dense, systematic | Analytics, fintech, dashboards |
| 8 | Dark Mode Refined | Focused, premium | Dev tools, media, professional |
| 9 | Bento Grid | Modular, editorial | Portfolio, features, showcases |
| 10 | Soft UI Evolution | Depth, calm | Wellness, beauty, luxury services |
| 11 | Aurora Borealis | Luminous, ethereal | AI, creative tools, futuristic |
| 12 | Cyberpunk UI | Neon, edge | Gaming, crypto, nightlife |
| 13 | AI-Native UI | Generative, adaptive | AI products, chat, co-pilots |
| 14 | Organic Biophilic | Natural, earthy | Sustainability, food, wellness |
| 15 | Spatial UI (visionOS) | Depth, immersive | AR/VR, visionOS, spatial computing |
| 16 | Chromatic Aberration | Glitchy, artistic | Creative agencies, music |
| 17 | Editorial Typography | Text-led, authoritative | News, publishing, research |
| 18 | Retro / Neo-Retro | Nostalgic, warm | Food, lifestyle, indie brands |
| 19 | Swiss / International | Grid, rational | Corporate, architecture, print |
| 20 | Material You | Adaptive, expressive | Android apps, Google ecosystem |
| 21 | Fluent Design | Acrylic, layered | Windows apps, Microsoft |
| 22 | Neon Glow | Electric, night | Gaming, entertainment, crypto |
| 23 | Gradient Mesh | Vibrant, modern | SaaS marketing, AI startups |
| 24 | Voice-First Multimodal | Minimal, cue-driven | Voice apps, assistants |
| 25 | Monochromatic Bold | Singular, committed | Fashion, luxury, statements |
| 26 | Interactive Cursor Design | Playful, engaging | Portfolios, creative agencies |
| 27 | Micro-interaction Rich | Tactile, responsive | Consumer apps, onboarding |
| 28 | Skeleton-First | Perceived speed | Data-heavy apps, feeds |
| 29 | Card-Dominant | Scannable, modular | Marketplaces, media |
| 30 | Command Palette | Power-user, fast | Dev tools, productivity |

---

## Detailed Style Specs

---

### 1 — Minimal Clean

**Mood:** Clear, confident, frictionless. Every element earns its place.

**Best for:** B2B SaaS, productivity tools, admin panels, documentation sites.

**Token overrides:**
```css
--color-bg: oklch(99% 0.002 264);
--color-surface: oklch(97% 0.003 264);
--color-border: oklch(90% 0.004 264);
--radius-md: 6px;
--shadow-md: 0 1px 4px oklch(0% 0 0 / 0.06);
--font-display: "Inter", system-ui, sans-serif;
--space-section: 80px;
```

**Required effects:** Subtle border or 1px shadow for card depth. No background gradients.

**Forbidden:** Drop shadows deeper than 8px, decorative illustrations, gradient backgrounds, rounded corners > 12px on layout containers.

**Accessibility:** All text ≥ 15px body. Contrast ≥ 4.5:1. Focus rings visible on white background (use 2px offset ring in accent color).

---

### 2 — Glassmorphism

**Mood:** Layered depth, translucent surfaces, modern premium.

**Best for:** Dashboards, mobile apps, AI interfaces, premium SaaS.

**Token overrides:**
```css
--color-surface: oklch(98% 0.005 264 / 0.6);   /* semi-transparent */
--color-border: oklch(100% 0 0 / 0.18);
--backdrop-filter: blur(12px) saturate(1.4);
--shadow-md: 0 4px 24px oklch(0% 0 0 / 0.12);
--radius-lg: 16px;
```

**Required effects:** `backdrop-filter: blur()` on all glass surfaces. White/light border at 15–25% opacity. Inner highlight: `inset 0 1px 0 oklch(100% 0 0 / 0.2)`.

**Forbidden:** Using on pure white backgrounds (glass needs a rich background to read). Dark text on dark glass without sufficient contrast. More than 3 layers of glass stacking.

**Accessibility:** Verify contrast carefully — glass backgrounds vary. Test at the darkest and lightest background state. Never rely on glass alone for interactive state — add a visible border on focus.

---

### 3 — Liquid Glass

**Mood:** Fluid, high-premium, Apple-adjacent. Glass that feels alive.

**Best for:** Premium consumer apps, iOS-adjacent design, creative tools, product showcases.

**Token overrides:**
```css
--color-surface: oklch(97% 0.006 264 / 0.55);
--backdrop-filter: blur(20px) saturate(1.8) brightness(1.05);
--border-radius-card: 20px;
--shadow-lg: 0 8px 40px oklch(0% 0 0 / 0.18), inset 0 1px 0 oklch(100% 0 0 / 0.3);
--transition-all: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Required effects:** Specular highlight (top-edge inner glow). Spring-physics motion on interactive elements. Background must be an image, gradient, or rich color — never flat white.

**Forbidden:** On dark-only backgrounds without light variation. Accessibility note: requires APCA-level contrast checking, not just WCAG 4.5:1.

---

### 4 — Neumorphism

**Mood:** Soft, extruded, tactile. Like plastic or clay lit from above.

**Best for:** Audio/music UIs, smart home controls, settings panels, niche consumer apps.

**Token overrides:**
```css
--color-bg: oklch(92% 0.008 264);
--color-surface: oklch(92% 0.008 264);   /* same as bg — surfaces are bg-colored */
--shadow-raised: 4px 4px 10px oklch(75% 0.010 264), -4px -4px 10px oklch(100% 0 0 / 0.7);
--shadow-inset: inset 4px 4px 10px oklch(75% 0.010 264), inset -4px -4px 10px oklch(100% 0 0 / 0.7);
--radius-md: 12px;
```

**Required effects:** Paired light/dark shadow on every raised element. Inset shadow for pressed/active states. Background and surface must match exactly.

**Forbidden:** High-saturation colors (ruins the monochrome shadow effect). Dark mode (neumorphism breaks on dark backgrounds). Using as the primary style for data-heavy screens.

**Accessibility warning:** Neumorphism has inherently low contrast between elements and background. Compensate with color or typography contrast for all interactive elements. Not recommended for accessibility-critical products.

---

### 5 — Claymorphism

**Mood:** Friendly, rounded, tactile, 3D-lite. Cute without being childish.

**Best for:** Consumer onboarding, mobile apps, gamified UIs, food/lifestyle brands.

**Token overrides:**
```css
--radius-card: 24px;
--radius-btn: 14px;
--shadow-clay: 0 8px 0 oklch(75% 0.020 [hue]),   /* bottom "thickness" shadow */
               0 12px 24px oklch(0% 0 0 / 0.14);
--color-surface: oklch(97% 0.015 [hue]);           /* slightly tinted surfaces */
--font-display: "Nunito", "DM Sans", system-ui, sans-serif;
```

**Required effects:** The "clay thickness" — a bottom shadow that creates 3D depth. Slightly tinted card surfaces (not pure white). Organic, slightly imperfect shapes.

**Forbidden:** Sharp corners, flat shadows, monochromatic color schemes, serif type for body.

---

### 6 — Brutalism

**Mood:** Raw, confrontational, anti-corporate. Uses design "mistakes" as aesthetics.

**Best for:** Creative portfolios, independent fashion, cultural institutions, experimental projects.

**Token overrides:**
```css
--color-bg: oklch(99% 0 0);              /* raw white */
--color-accent: oklch(52% 0.28 25);      /* loud red or black */
--font-display: "Space Grotesk", "Courier New", monospace;
--font-weight-display: 900;
--radius-md: 0px;                        /* no rounding */
--border-width: 2px;
--shadow-brutal: 4px 4px 0 oklch(8% 0 0);   /* hard offset shadow, no blur */
```

**Required effects:** Hard offset box shadow (no blur). Visible borders everywhere. Intentionally asymmetric or broken grid usage.

**Forbidden:** Rounded corners, gentle shadows, polished illustrations, animation heavier than instant state changes.

---

### 7 — Data Brutalism

**Mood:** Dense, systematic, information-first. Brutalism meets analytics.

**Best for:** Financial terminals, analytics dashboards, developer consoles, data-intensive B2B.

**Token overrides:**
```css
--font-display: "IBM Plex Mono", "Roboto Mono", monospace;
--font-body: "IBM Plex Sans", system-ui, sans-serif;
--color-bg: oklch(10% 0.005 264);        /* near-black */
--color-accent: oklch(72% 0.22 142);     /* green terminal */
--color-accent-2: oklch(72% 0.18 55);    /* amber */
--radius-md: 2px;
--border-width: 1px;
--line-height-data: 1.3;                 /* tight for data density */
```

**Required effects:** Monospace font for all data values. Grid-aligned layout with visible structure. High-density tables and charts as primary content.

**Forbidden:** Illustrations, decorative icons, rounded cards, soft shadows, large whitespace sections.

---

### 8 — Dark Mode Refined

**Mood:** Focused, premium, reduces eye strain. Elevation via lightness, not shadows.

**Best for:** Developer tools, code editors, media players, professional creative tools.

**Token overrides:** Use Direction 2 (Dark Technical) from `visual-directions.md` as base, then:
```css
--color-surface-elevated: oklch(20% 0.007 264);  /* elevated above --color-surface */
--color-surface-overlay: oklch(24% 0.008 264);   /* modals, drawers */
--shadow-elevation: 0 0 0 1px var(--color-border);  /* border replaces shadow on dark */
```

**Required effects:** Elevation through lightness steps (darker = lower, lighter = higher — opposite of light mode). Focus rings must be visible on dark (use accent color at 100% opacity, never transparent).

**Forbidden:** Pure `#000000` black (use `oklch(8-10%)` instead for depth). White text at 100% opacity on dark (use `oklch(90-93%)`). Heavy drop shadows (they're invisible on dark anyway).

---

### 9 — Bento Grid

**Mood:** Modular, editorial, scannable. Dashboard-meets-editorial.

**Best for:** Feature showcases, portfolio sites, product pages, dashboards.

**Token overrides:**
```css
--grid-gap: 12px;
--radius-card: 16px;
--color-surface: oklch(97% 0.003 264);
--color-surface-2: oklch(94% 0.004 264);
/* Cards vary in size: 1×1, 2×1, 1×2, 2×2 */
```

**Required effects:** Asymmetric grid cells (mix of sizes). Each cell has a single focus — one metric, one feature, one visual. Background color variation between cells (not all the same color).

**Forbidden:** Equal-sized grid cells. Overfilling cells with multiple concepts. Adding a navbar that competes with the grid.

---

### 10 — Soft UI Evolution

**Mood:** Premium softness, tactile depth, calm luxury. Modern evolution of neumorphism with full color.

**Best for:** Wellness, beauty, spa, luxury services, lifestyle brands.

**Token overrides:**
```css
--color-bg: oklch(97% 0.012 72);         /* warm cream */
--color-surface: oklch(95% 0.014 72);
--shadow-soft: 0 4px 20px oklch(72% 0.018 72 / 0.15),
               0 1px 4px oklch(72% 0.018 72 / 0.08);
--radius-card: 20px;
--font-display: "Cormorant Garamond", Georgia, serif;
```

**Required effects:** Multi-layered soft shadows. Warm-tinted surfaces. Generous whitespace. Typography with elegance — display serif for headings.

**Forbidden:** Hard borders, sharp corners, bright saturated colors, monospace type.

---

### 11 — Aurora Borealis

**Mood:** Luminous, ethereal, generative. Light that moves like aurora.

**Best for:** AI products, creative tools, futuristic SaaS, high-concept landing pages.

**Token overrides:**
```css
--color-bg: oklch(8% 0.008 264);
--gradient-aurora: radial-gradient(ellipse at 20% 50%,
  oklch(55% 0.22 280 / 0.4) 0%,
  oklch(55% 0.18 180 / 0.3) 40%,
  transparent 70%),
  radial-gradient(ellipse at 80% 20%,
  oklch(60% 0.20 320 / 0.35) 0%,
  transparent 60%);
--color-text-primary: oklch(92% 0.005 264);
--color-accent: oklch(72% 0.22 142);
```

**Required effects:** Animated or static aurora gradient on the background. Dark base — aurora only reads on near-black. Subtle animation (`@keyframes aurora` shifting gradient positions, 8–12s duration, `prefers-reduced-motion` respected).

**Forbidden:** On light backgrounds. Saturating the entire UI with gradients — the aurora is the background only. Accessibility: ensure text contrast against the gradient is verified at its darkest and lightest point.

---

### 12 — Cyberpunk UI

**Mood:** Neon on dark, gritty, near-future.

**Best for:** Gaming, crypto, nightlife, esports, dark-culture brands.

**Token overrides:**
```css
--color-bg: oklch(6% 0.006 264);
--color-accent: oklch(68% 0.32 180);     /* cyan */
--color-accent-2: oklch(62% 0.32 300);   /* magenta */
--font-display: "Rajdhani", "Exo 2", system-ui, sans-serif;
--border-style: 1px solid oklch(68% 0.32 180 / 0.6);
--shadow-neon: 0 0 8px oklch(68% 0.32 180 / 0.6), 0 0 24px oklch(68% 0.32 180 / 0.3);
```

**Required effects:** Neon glow on accent elements only (not everything). Scanline or texture overlay (CSS `background-image: repeating-linear-gradient`). Angular/diagonal design elements.

**Forbidden:** On light backgrounds. Using neon glow on body text (illegible). Applying to professional/trust-critical products.

---

### 13 — AI-Native UI

**Mood:** Generative, adaptive, streaming-first. Designed for AI output.

**Best for:** AI chat interfaces, co-pilots, agents, LLM-powered tools.

**Token overrides:**
```css
--color-bg: oklch(10% 0.005 264);
--color-bubble-user: oklch(52% 0.18 264);   /* user message */
--color-bubble-ai: oklch(18% 0.007 264);    /* AI message */
--color-streaming: oklch(72% 0.22 142);     /* streaming cursor */
--radius-bubble: 18px 18px 4px 18px;        /* chat bubble shape */
--font-mono: "Geist Mono", monospace;        /* code blocks */
```

**Required effects:** Streaming text animation (blinking cursor or typewriter). Distinct visual treatment for user vs. AI messages. Code blocks in monospace with syntax highlighting. Tool use / thinking states visually distinct from final output.

**Forbidden:** Treating AI output the same as static content. No loading states for generation. Showing raw JSON to users without formatting.

---

### 14 — Organic Biophilic

**Mood:** Natural, grounded, earthy. Design inspired by living systems.

**Best for:** Sustainability brands, food and beverage, outdoor/nature, wellness.

**Token overrides:**
```css
--color-bg: oklch(96% 0.018 90);         /* warm sand */
--color-accent: oklch(42% 0.14 142);     /* forest green */
--color-accent-2: oklch(62% 0.16 55);    /* warm terracotta */
--font-display: "Fraunces", Georgia, serif;
--radius-card: 4px 20px 4px 20px;        /* organic, irregular */
--texture: url("noise.svg");             /* paper/grain texture overlay */
```

**Required effects:** Grain/texture overlay (subtle SVG noise, 3–5% opacity). Organic shapes — no perfect rectangles. Earthy, desaturated color palette.

**Forbidden:** Neon colors, harsh geometry, tech-minimal style, monospace type.

---

### 15 — Spatial UI (visionOS)

**Mood:** Depth, immersive, physical-digital blend. For spatial/AR contexts.

**Best for:** visionOS apps, AR interfaces, spatial computing, immersive web.

**Token overrides:**
```css
--color-surface: oklch(98% 0.004 264 / 0.5);   /* glass panel */
--backdrop-filter: blur(40px) saturate(2.0);
--shadow-spatial: 0 24px 80px oklch(0% 0 0 / 0.35);
--radius-panel: 24px;
--font-display: "SF Pro Display", system-ui, sans-serif;
--depth-layer-1: translateZ(0px);
--depth-layer-2: translateZ(20px);
--depth-layer-3: translateZ(40px);
```

**Required effects:** Z-depth layering for panels. Translucent glass panels. Generous touch/gaze targets (min 44pt). Motion parallax on scroll.

**Forbidden:** Hard shadows (use ambient). Flat 2D layouts without depth cues. Small touch targets.

---

### 16 — Editorial Typography

**Mood:** Text-first, authoritative, journalistic.

**Best for:** News, publishing, research, long-form content, documentation.

**Token overrides:** Use Direction 3 (Warm Editorial) from `visual-directions.md` as base. Additional:
```css
--font-display: "Playfair Display", "Libre Baskerville", Georgia, serif;
--font-body: "Source Serif 4", Georgia, serif;     /* body also serif */
--line-height-body: 1.85;
--max-prose-width: 68ch;
--drop-cap: font-size 4em, line-height 0.85, float left, margin-right 0.1em;
--text-4xl: 64px;
--letter-spacing-headline: -0.03em;
```

**Required effects:** Drop cap on article opening (optional). Pull quotes with large decorative quotation marks. Generous leading. Clear section break treatments (rule lines, space, or ornamental dividers).

**Forbidden:** Mixing too many type styles. Sans-serif body for long-form editorial. Cramped line-height.

---

### 17 — Retro / Neo-Retro

**Mood:** Nostalgic warmth, handcrafted, vintage.

**Best for:** Food & beverage, indie brands, music, lifestyle, coffee shops.

**Token overrides:**
```css
--color-bg: oklch(95% 0.025 72);         /* aged paper */
--color-accent: oklch(48% 0.22 42);      /* rust orange */
--color-accent-2: oklch(35% 0.14 142);   /* forest green */
--font-display: "Abril Fatface", "DM Serif Display", serif;
--font-body: "Lato", system-ui, sans-serif;
--texture: sepia filter + noise overlay;
--border-style: 2px dashed oklch(72% 0.016 72);   /* vintage dashed border */
```

**Required effects:** Texture overlay (paper grain). Slightly muted/sepia color treatment. Hand-drawn or stamp-style decorative elements (SVG).

**Forbidden:** Crisp tech-minimal elements, neon colors, very fine hairline typography.

---

### 18 — Swiss / International

**Mood:** Grid-perfect, rational, classical modernism.

**Best for:** Architecture firms, corporate identities, art institutions, print-adjacent brands.

**Token overrides:**
```css
--font-display: "Helvetica Neue", "Aktiv Grotesk", Arial, sans-serif;
--font-weight-display: 700;
--color-accent: oklch(52% 0.22 25);      /* red — classic Swiss accent */
--radius-md: 0px;
--grid-columns: 12;
--grid-gap: 20px;
--margin-page: 40px;
--letter-spacing-caps: 0.12em;
```

**Required effects:** Strict 12-column grid. Black and white dominant with one accent color. Capital letters with generous tracking for labels. No decorative elements — content is decoration.

**Forbidden:** Rounded corners, gradients, illustrations, more than 2 typefaces, decorative icons.

---

### 19 — Gradient Mesh

**Mood:** Vibrant, modern, startup energy. Aurora-lite for light backgrounds.

**Best for:** SaaS marketing sites, AI startup landing pages, modern tech brands.

**Token overrides:**
```css
--color-bg: oklch(99% 0.002 264);
--gradient-hero: radial-gradient(ellipse at 30% 40%,
  oklch(78% 0.16 280 / 0.35),
  transparent 60%),
  radial-gradient(ellipse at 70% 60%,
  oklch(72% 0.18 190 / 0.3),
  transparent 55%);
--font-display: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
--color-accent: oklch(55% 0.22 264);
```

**Required effects:** Soft mesh gradient in hero section only. White/near-white surface for content areas. The gradient is a background accent, not a surface for text.

**Forbidden:** Text directly on the gradient without a solid backing. Using gradients on every section. Purple + pink gradient specifically (overused AI cliché — use different hues).

---

### 20 — Command Palette

**Mood:** Power-user, keyboard-first, instant.

**Best for:** Developer tools, productivity apps, IDE-adjacent, anything with complex navigation.

**Token overrides:**
```css
--color-bg: oklch(10% 0.005 264);
--color-surface-palette: oklch(14% 0.006 264);
--color-surface-highlight: oklch(22% 0.010 264);
--font-mono: "Geist Mono", "JetBrains Mono", monospace;
--font-body: "Geist", "Inter", system-ui, sans-serif;
--radius-palette: 12px;
--shadow-palette: 0 24px 64px oklch(0% 0 0 / 0.6);
```

**Required effects:** Always-accessible command palette (⌘K / Ctrl+K). Keyboard shortcut hints in UI. Selected state clearly highlighted (not just a color change — use background fill). Instant response — no loading spinners for palette open.

**Forbidden:** Mouse-only interactions as the primary pattern. Slow open animation on the palette (max 100ms). Hiding keyboard shortcuts entirely.

---

## Style Selection Guide

When the user has not specified a style, use this decision tree:

```
What is the product category?

SaaS / B2B / Admin         → Minimal Clean (1) or Data Brutalism (7) or Dark Mode Refined (8)
Consumer App / Mobile      → Claymorphism (5) or Soft UI Evolution (10) or Material You (20)
AI / Developer Tool        → AI-Native UI (13) or Dark Technical + Command Palette (20)
Dashboard / Analytics      → Data Brutalism (7) or Bento Grid (9) or Dark Mode Refined (8)
Landing Page / Marketing   → Gradient Mesh (19) or Bento Grid (9) or Aurora Borealis (11)
Wellness / Beauty / Luxury → Soft UI Evolution (10) or Organic Biophilic (14) or Editorial Typography (16)
Portfolio / Creative       → Brutalism (6) or Bento Grid (9) or Chromatic Aberration (16)
Gaming / Crypto            → Cyberpunk UI (12) or Neon Glow or Dark + Aurora (11)
Publishing / Editorial     → Editorial Typography (16) or Warm Editorial direction
Food / Lifestyle           → Retro / Neo-Retro (17) or Organic Biophilic (14)
Enterprise / Corporate     → Swiss / International (18) or Minimal Clean (1)
AR / Spatial               → Spatial UI (15) or Liquid Glass (3)
```

**Always verify:** The chosen style must not conflict with accessibility requirements. Styles 4 (Neumorphism), 6 (Brutalism), 12 (Cyberpunk), and 15 (Spatial) require extra contrast verification.

---

## Style Anti-Pattern Cross-Reference

| If you see this... | The style is broken |
|---|---|
| Glass on white background | Glassmorphism misapplied |
| Neon glow on body text | Cyberpunk misapplied |
| Neumorphism in dark mode | Fundamental incompatibility |
| Gradient mesh on every section | Gradient Mesh overextended |
| Bento grid with equal-sized cells | Bento misapplied |
| Swiss/International with rounded corners | Swiss misapplied |
| Aurora borealis on light background | Aurora misapplied |
| Claymorphism without clay thickness shadow | Missing the defining effect |
