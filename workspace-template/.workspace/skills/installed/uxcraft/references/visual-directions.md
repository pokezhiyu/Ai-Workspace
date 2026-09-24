# Visual Directions

Load this file when a user has no brand and selects "No brand yet" in the discovery question form. Present the 5 direction summaries, wait for the user to select one, then bind the direction's full token spec as the design baseline.

Do not improvise a color palette. Do not default to blue + white. Select a direction and apply it precisely.

---

## How to Use

1. Present the 5 direction summaries (the short descriptions below) to the user.
2. Ask: "Which direction fits your vision? Pick a number or describe a preference."
3. Once selected, apply the full token block for that direction.
4. State in the output: "Visual direction: [name]. All tokens are provisional — update when a brand identity is confirmed."
5. Every render uses that direction's `:root` tokens until the user establishes a brand.

---

## Direction 1 — Neutral Modern

**One-line:** Clean, rational, whitespace-led. No personality extremes — works for any B2B SaaS, productivity, or professional tool.

**When to use:** The user needs something polished and professional but has no strong opinion about aesthetics. Safe default for B2B, admin, or internal tools.

### Token Spec

```css
:root {
  /* Color */
  --color-bg:           oklch(99% 0.002 264);   /* #FAFAFA near-white */
  --color-surface:      oklch(97% 0.003 264);   /* #F4F4F6 */
  --color-surface-2:    oklch(94% 0.004 264);   /* #EDEDF0 */
  --color-border:       oklch(88% 0.005 264);   /* #DDDDE3 */
  --color-text-primary: oklch(15% 0.010 264);   /* #1A1A22 */
  --color-text-secondary: oklch(45% 0.010 264); /* #666677 */
  --color-text-muted:   oklch(65% 0.008 264);   /* #999AAA */
  --color-accent:       oklch(52% 0.18 264);    /* #4361EE indigo */
  --color-accent-hover: oklch(45% 0.18 264);    /* darker */
  --color-success:      oklch(52% 0.16 142);    /* #1A7F5A green */
  --color-warning:      oklch(72% 0.18 72);     /* #D4A017 amber */
  --color-error:        oklch(52% 0.22 25);     /* #C0392B red */

  /* Typography */
  --font-display: "Inter", "Helvetica Neue", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "Fira Code", monospace;

  /* Scale */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   17px;
  --text-xl:   20px;
  --text-2xl:  24px;
  --text-3xl:  32px;
  --text-4xl:  40px;

  /* Spacing (8px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* Shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;

  /* Elevation */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.06);
  --shadow-md: 0 4px 12px oklch(0% 0 0 / 0.08);
  --shadow-lg: 0 8px 32px oklch(0% 0 0 / 0.10);
}
```

---

## Direction 2 — Dark Technical

**One-line:** Near-black surface, high-contrast text, vivid accent. Developer tools, AI products, terminal-adjacent interfaces.

**When to use:** Technical audience, developer tool, AI product, performance-focused brand, or any context where dark mode is the primary experience.

### Token Spec

```css
:root {
  /* Color */
  --color-bg:           oklch(10% 0.005 264);   /* #0D0D10 */
  --color-surface:      oklch(14% 0.006 264);   /* #161619 */
  --color-surface-2:    oklch(18% 0.007 264);   /* #1E1E22 */
  --color-border:       oklch(24% 0.008 264);   /* #2A2A30 */
  --color-text-primary: oklch(93% 0.005 264);   /* #EBEBF0 */
  --color-text-secondary: oklch(65% 0.008 264); /* #999AAA */
  --color-text-muted:   oklch(48% 0.008 264);   /* #666677 */
  --color-accent:       oklch(72% 0.22 142);    /* #3ECF8E green — use for links, active, CTA */
  --color-accent-hover: oklch(78% 0.22 142);    /* lighter on hover */
  --color-success:      oklch(68% 0.18 142);    /* green */
  --color-warning:      oklch(78% 0.18 72);     /* amber */
  --color-error:        oklch(62% 0.22 25);     /* red */

  /* Code syntax */
  --syntax-string:  oklch(72% 0.14 42);         /* warm orange */
  --syntax-keyword: oklch(68% 0.18 264);        /* blue-indigo */
  --syntax-comment: oklch(52% 0.08 142);        /* muted green */
  --syntax-number:  oklch(78% 0.14 142);        /* light green */

  /* Typography */
  --font-display: "Geist", "Inter", system-ui, sans-serif;
  --font-body:    "Geist", "Inter", system-ui, sans-serif;
  --font-mono:    "Geist Mono", "JetBrains Mono", monospace;

  /* Scale — same as Neutral Modern */
  --text-xs: 11px; --text-sm: 13px; --text-base: 15px; --text-lg: 17px;
  --text-xl: 20px; --text-2xl: 24px; --text-3xl: 32px; --text-4xl: 40px;

  /* Spacing — same as Neutral Modern */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;

  /* Shape */
  --radius-sm: 4px; --radius-md: 6px; --radius-lg: 10px; --radius-xl: 14px; --radius-pill: 999px;

  /* Elevation — glow replaces shadow on dark */
  --shadow-sm: 0 0 0 1px var(--color-border);
  --shadow-md: 0 4px 16px oklch(0% 0 0 / 0.4);
  --shadow-lg: 0 8px 40px oklch(0% 0 0 / 0.6);
}
```

---

## Direction 3 — Warm Editorial

**One-line:** Cream backgrounds, serif headings, generous whitespace. Publishing, culture, premium lifestyle, editorial content, high-end brands.

**When to use:** Content-led products, editorial sites, premium lifestyle, food/culture/arts, or any brand that values story over speed.

### Token Spec

```css
:root {
  /* Color */
  --color-bg:           oklch(97% 0.012 72);    /* #FAF7F2 warm cream */
  --color-surface:      oklch(95% 0.014 72);    /* #F4EFE8 */
  --color-surface-2:    oklch(92% 0.016 72);    /* #EDE5DA */
  --color-border:       oklch(85% 0.018 72);    /* #D9CEBC */
  --color-text-primary: oklch(18% 0.020 72);    /* #2A2118 near-black warm */
  --color-text-secondary: oklch(42% 0.016 72);  /* #6B5B48 warm brown */
  --color-text-muted:   oklch(62% 0.012 72);    /* #9A8B7A */
  --color-accent:       oklch(38% 0.16 42);     /* #8B3A1A deep terra */
  --color-accent-hover: oklch(32% 0.16 42);     /* darker */
  --color-success:      oklch(48% 0.14 142);    /* forest green */
  --color-warning:      oklch(68% 0.18 72);     /* warm amber */
  --color-error:        oklch(48% 0.20 25);     /* deep red */

  /* Typography */
  --font-display: "Playfair Display", "Cormorant Garamond", Georgia, serif;
  --font-body:    "Lato", "Source Sans 3", system-ui, sans-serif;
  --font-mono:    "Courier Prime", "Courier New", monospace;

  /* Scale — editorial uses larger body */
  --text-xs:   12px;
  --text-sm:   14px;
  --text-base: 17px;  /* larger for readability */
  --text-lg:   20px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  44px;
  --text-4xl:  60px;

  /* Spacing — editorial is generous */
  --space-1: 6px; --space-2: 12px; --space-3: 18px; --space-4: 24px;
  --space-6: 36px; --space-8: 48px; --space-12: 72px; --space-16: 96px; --space-24: 144px;

  /* Shape — editorial avoids round corners */
  --radius-sm: 2px; --radius-md: 2px; --radius-lg: 4px; --radius-xl: 4px; --radius-pill: 2px;

  /* Elevation */
  --shadow-sm: 0 1px 3px oklch(18% 0.020 72 / 0.10);
  --shadow-md: 0 4px 12px oklch(18% 0.020 72 / 0.12);
  --shadow-lg: 0 8px 32px oklch(18% 0.020 72 / 0.14);

  /* Editorial specific */
  --line-height-body: 1.85;
  --line-height-heading: 1.15;
  --letter-spacing-heading: -0.02em;
  --letter-spacing-caption: 0.08em;
  --max-prose-width: 68ch;
}
```

---

## Direction 4 — Bold Energetic

**One-line:** High-contrast, high-energy. Strong typographic statements, minimal decoration. Sports, fitness, food, gaming, consumer apps, campaign sites.

**When to use:** Consumer brands targeting young audiences, energy or action-oriented products, brands where personality and boldness are the differentiator.

### Token Spec

```css
:root {
  /* Color */
  --color-bg:           oklch(99% 0.002 0);     /* #FAFAFA pure white */
  --color-surface:      oklch(96% 0.004 0);     /* #F2F2F2 */
  --color-surface-2:    oklch(92% 0.006 0);     /* #E8E8E8 */
  --color-border:       oklch(84% 0.006 0);     /* #D4D4D4 */
  --color-text-primary: oklch(8% 0.005 0);      /* #0D0D0D near-black */
  --color-text-secondary: oklch(38% 0.006 0);   /* #555555 */
  --color-text-muted:   oklch(58% 0.006 0);     /* #888888 */
  --color-accent:       oklch(52% 0.26 25);     /* #D32F2F bold red */
  --color-accent-hover: oklch(44% 0.26 25);     /* darker red */
  --color-accent-alt:   oklch(8% 0.005 0);      /* black — for secondary CTA */
  --color-success:      oklch(50% 0.18 142);
  --color-warning:      oklch(68% 0.22 72);
  --color-error:        oklch(52% 0.22 25);

  /* Typography — condensed, heavy */
  --font-display: "Barlow Condensed", "Bebas Neue", "Arial Narrow", sans-serif;
  --font-body:    "Barlow", "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", monospace;
  --font-weight-display: 800;  /* ExtraBold or Black */

  /* Scale — headlines go large */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  44px;
  --text-4xl:  72px;  /* campaign headlines */

  /* Spacing — tighter than editorial */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;

  /* Shape — bold uses sharper or pill */
  --radius-sm: 2px; --radius-md: 4px; --radius-lg: 6px; --radius-xl: 8px; --radius-pill: 999px;

  /* Elevation */
  --shadow-sm: 0 2px 4px oklch(0% 0 0 / 0.12);
  --shadow-md: 0 4px 16px oklch(0% 0 0 / 0.16);
  --shadow-lg: 0 8px 40px oklch(0% 0 0 / 0.20);

  /* Bold specific */
  --letter-spacing-display: -0.01em;
  --letter-spacing-label: 0.08em;  /* all-caps labels */
  --text-transform-display: uppercase;  /* optional, brand-dependent */
}
```

---

## Direction 5 — Calm Trust

**One-line:** Soft blues, rounded shapes, plenty of air. Healthcare, wellness, finance, education — anywhere trust and calm are the emotional goal.

**When to use:** Any product where the user might be anxious, uncertain, or making high-stakes decisions. Medtech, finance, mental health, insurance, legal, education.

### Token Spec

```css
:root {
  /* Color */
  --color-bg:           oklch(98% 0.006 230);   /* #F5F9FD light blue-white */
  --color-surface:      oklch(96% 0.008 230);   /* #EDF4FB */
  --color-surface-2:    oklch(93% 0.010 230);   /* #E2EDF7 */
  --color-border:       oklch(87% 0.012 230);   /* #C8DCF0 */
  --color-text-primary: oklch(18% 0.018 230);   /* #1A2B3C deep blue-black */
  --color-text-secondary: oklch(42% 0.016 230); /* #4A6380 */
  --color-text-muted:   oklch(62% 0.012 230);   /* #7A9AB8 */
  --color-accent:       oklch(52% 0.18 230);    /* #0072CE calm blue */
  --color-accent-hover: oklch(45% 0.18 230);    /* darker */
  --color-accent-soft:  oklch(90% 0.06 230);    /* #D6EAFB — for tinted surfaces */
  --color-success:      oklch(52% 0.16 165);    /* #1A7F6A teal-green */
  --color-warning:      oklch(68% 0.18 80);     /* muted amber */
  --color-error:        oklch(52% 0.18 25);     /* calm red */

  /* Typography — humanist, readable */
  --font-display: "DM Sans", "Source Sans 3", "Open Sans", system-ui, sans-serif;
  --font-body:    "DM Sans", "Source Sans 3", system-ui, sans-serif;
  --font-mono:    "Roboto Mono", monospace;

  /* Scale */
  --text-xs:   12px;
  --text-sm:   14px;
  --text-base: 16px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  36px;
  --text-4xl:  48px;

  /* Spacing — generous, breathes */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;

  /* Shape — rounded, soft */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Elevation — soft, not dramatic */
  --shadow-sm: 0 1px 4px oklch(18% 0.018 230 / 0.06);
  --shadow-md: 0 4px 16px oklch(18% 0.018 230 / 0.08);
  --shadow-lg: 0 8px 32px oklch(18% 0.018 230 / 0.10);

  /* Calm Trust specific */
  --line-height-body: 1.7;
  --line-height-heading: 1.3;
}
```

---

## Direction Summary (present to user)

When presenting options, use this short-form:

```
Pick a visual direction:

1. Neutral Modern     — Clean, rational, professional. No personality extremes.
                        Great for: SaaS, productivity tools, admin, B2B.

2. Dark Technical     — Near-black surface, vivid accent. Developer-first.
                        Great for: Dev tools, AI products, technical platforms.

3. Warm Editorial     — Cream, serif type, generous whitespace. Story-first.
                        Great for: Publishing, food, culture, premium lifestyle.

4. Bold Energetic     — High-contrast, heavy type, big headlines.
                        Great for: Sports, fitness, food brands, consumer apps.

5. Calm Trust         — Soft blues, rounded shapes, breathes easily.
                        Great for: Healthcare, finance, wellness, education.

Or describe your preference and I'll match the closest direction.
```

---

## Applying a Direction

Once the user selects a direction:

1. Copy the full `:root` token block into the design context.
2. Declare: "Visual direction: [Direction Name] applied. Using [primary palette description] with [font stack]."
3. All subsequent design output uses only tokens from this block — no ad-hoc color or spacing values.
4. If the user later provides real brand assets, run the brand extraction protocol (`references/design-discovery-protocol.md`) and override the direction tokens with the extracted brand values.
