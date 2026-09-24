# Color Scale System

Load this file when building a design system that requires full architectural color scales. Every production-grade design system needs 11-step shade ramps (50–950), not just 5–7 semantic tokens.

Use these scales as the foundation for your token system. Then map semantic roles (primary, surface, text, border, accent, semantic states) onto the appropriate shade steps.

---

## How to Use

1. Choose a hue for your brand primary color.
2. Use the scale template below to generate the 11 steps (50–950) in OKLch.
3. Map semantic roles to specific steps using the role-to-step mapping table.
4. For secondary, neutral, and semantic colors (success/warning/error/info), use the provided base scales.
5. Export as CSS custom properties using the naming convention `--[color-name]-[step]`.

---

## Scale Generation Formula (OKLch)

For any hue `H`, the 11-step scale uses lightness and chroma progressions:

| Step | Lightness | Chroma multiplier | Usage |
|------|-----------|-------------------|-------|
| 50 | 97% | 0.15× base chroma | Tinted backgrounds, hover states |
| 100 | 93% | 0.25× | Soft backgrounds, tags |
| 200 | 85% | 0.40× | Borders, dividers |
| 300 | 74% | 0.60× | Disabled states, placeholder |
| 400 | 62% | 0.80× | Muted text, icons |
| 500 | 52% | 1.00× **base** | Primary brand color |
| 600 | 44% | 0.95× | Hover on primary |
| 700 | 36% | 0.90× | Active/pressed states |
| 800 | 27% | 0.80× | Dark headings on light |
| 900 | 18% | 0.65× | Near-black brand tint |
| 950 | 12% | 0.50× | Deepest shade, dark mode bg |

**Example for Indigo (H=264, base chroma=0.20):**

```css
:root {
  --indigo-50:  oklch(97% 0.030 264);
  --indigo-100: oklch(93% 0.050 264);
  --indigo-200: oklch(85% 0.080 264);
  --indigo-300: oklch(74% 0.120 264);
  --indigo-400: oklch(62% 0.160 264);
  --indigo-500: oklch(52% 0.200 264);  /* brand primary */
  --indigo-600: oklch(44% 0.190 264);
  --indigo-700: oklch(36% 0.180 264);
  --indigo-800: oklch(27% 0.160 264);
  --indigo-900: oklch(18% 0.130 264);
  --indigo-950: oklch(12% 0.100 264);
}
```

---

## Semantic Role → Step Mapping

Once you have your scales, map semantic tokens to steps:

| Semantic Token | Light Mode Step | Dark Mode Step | Notes |
|---|---|---|---|
| `--color-bg` | Neutral 50 | Neutral 950 | Page background |
| `--color-surface` | Neutral 100 | Neutral 900 | Card/panel background |
| `--color-surface-2` | Neutral 200 | Neutral 800 | Nested surface |
| `--color-border` | Neutral 300 | Neutral 700 | Dividers, input border |
| `--color-border-strong` | Neutral 400 | Neutral 600 | Emphasis borders |
| `--color-text-muted` | Neutral 400 | Neutral 500 | Placeholder, disabled |
| `--color-text-secondary` | Neutral 600 | Neutral 400 | Meta, captions |
| `--color-text-primary` | Neutral 900 | Neutral 50 | Body copy |
| `--color-accent` | Primary 500 | Primary 400 | CTAs, links, active |
| `--color-accent-hover` | Primary 600 | Primary 300 | Hover on accent |
| `--color-accent-active` | Primary 700 | Primary 200 | Pressed state |
| `--color-accent-soft` | Primary 100 | Primary 900 | Tinted backgrounds |
| `--color-accent-text` | Primary 700 | Primary 200 | Text on tinted bg |

---

## Base Neutral Scale (Gray)

Use as the backbone for backgrounds, text, and borders.

```css
:root {
  /* Neutral — cool gray, H=264, chroma=0.005 */
  --neutral-50:  oklch(99% 0.002 264);   /* #FAFAFA */
  --neutral-100: oklch(96% 0.003 264);   /* #F4F4F6 */
  --neutral-200: oklch(92% 0.004 264);   /* #EBEBEE */
  --neutral-300: oklch(85% 0.006 264);   /* #D8D8DE */
  --neutral-400: oklch(72% 0.008 264);   /* #ABABB8 */
  --neutral-500: oklch(58% 0.009 264);   /* #818190 */
  --neutral-600: oklch(46% 0.009 264);   /* #5E5E6E */
  --neutral-700: oklch(34% 0.008 264);   /* #434352 */
  --neutral-800: oklch(24% 0.007 264);   /* #2C2C38 */
  --neutral-900: oklch(15% 0.006 264);   /* #1A1A24 */
  --neutral-950: oklch(9%  0.005 264);   /* #0E0E14 */
}
```

**Warm neutral variant** (use for editorial/warm brand):
```css
:root {
  /* Warm Neutral — H=72, chroma=0.010 */
  --warm-50:  oklch(98% 0.008 72);
  --warm-100: oklch(95% 0.012 72);
  --warm-200: oklch(90% 0.016 72);
  --warm-300: oklch(82% 0.018 72);
  --warm-400: oklch(70% 0.016 72);
  --warm-500: oklch(56% 0.014 72);
  --warm-600: oklch(44% 0.012 72);
  --warm-700: oklch(33% 0.010 72);
  --warm-800: oklch(24% 0.008 72);
  --warm-900: oklch(16% 0.007 72);
  --warm-950: oklch(10% 0.005 72);
}
```

---

## Brand Color Scales by Hue Family

### Blue / Indigo (Trust, Technology, Finance)
```css
:root {
  --blue-50:  oklch(97% 0.020 230);
  --blue-100: oklch(93% 0.040 230);
  --blue-200: oklch(85% 0.070 230);
  --blue-300: oklch(74% 0.110 230);
  --blue-400: oklch(62% 0.150 230);
  --blue-500: oklch(52% 0.180 230);   /* #0072CE calm blue */
  --blue-600: oklch(44% 0.170 230);
  --blue-700: oklch(36% 0.160 230);
  --blue-800: oklch(27% 0.140 230);
  --blue-900: oklch(18% 0.110 230);
  --blue-950: oklch(11% 0.080 230);

  --indigo-50:  oklch(97% 0.025 264);
  --indigo-100: oklch(93% 0.050 264);
  --indigo-200: oklch(85% 0.080 264);
  --indigo-300: oklch(74% 0.120 264);
  --indigo-400: oklch(62% 0.160 264);
  --indigo-500: oklch(52% 0.200 264);   /* #4361EE */
  --indigo-600: oklch(44% 0.190 264);
  --indigo-700: oklch(36% 0.180 264);
  --indigo-800: oklch(27% 0.160 264);
  --indigo-900: oklch(18% 0.130 264);
  --indigo-950: oklch(11% 0.095 264);
}
```

### Green (Health, Finance-positive, Nature, Success)
```css
:root {
  --green-50:  oklch(97% 0.025 142);
  --green-100: oklch(93% 0.050 142);
  --green-200: oklch(85% 0.085 142);
  --green-300: oklch(74% 0.120 142);
  --green-400: oklch(62% 0.150 142);
  --green-500: oklch(52% 0.160 142);   /* #1A7F5A */
  --green-600: oklch(44% 0.150 142);
  --green-700: oklch(36% 0.140 142);
  --green-800: oklch(27% 0.120 142);
  --green-900: oklch(18% 0.095 142);
  --green-950: oklch(11% 0.070 142);
}
```

### Red (Energy, Alert, Food, Bold brands)
```css
:root {
  --red-50:  oklch(97% 0.025 25);
  --red-100: oklch(93% 0.050 25);
  --red-200: oklch(85% 0.090 25);
  --red-300: oklch(74% 0.130 25);
  --red-400: oklch(62% 0.180 25);
  --red-500: oklch(52% 0.220 25);   /* #C0392B */
  --red-600: oklch(44% 0.210 25);
  --red-700: oklch(36% 0.195 25);
  --red-800: oklch(27% 0.170 25);
  --red-900: oklch(18% 0.135 25);
  --red-950: oklch(11% 0.100 25);
}
```

### Amber / Gold (Warning, Luxury, Premium, Energy)
```css
:root {
  --amber-50:  oklch(98% 0.030 72);
  --amber-100: oklch(94% 0.060 72);
  --amber-200: oklch(88% 0.100 72);
  --amber-300: oklch(80% 0.140 72);
  --amber-400: oklch(74% 0.170 72);
  --amber-500: oklch(72% 0.180 72);   /* #D4A017 */
  --amber-600: oklch(62% 0.170 72);
  --amber-700: oklch(50% 0.160 72);
  --amber-800: oklch(38% 0.140 72);
  --amber-900: oklch(26% 0.110 72);
  --amber-950: oklch(16% 0.080 72);
}
```

### Purple / Violet (Creative, Premium SaaS, Innovation)
```css
:root {
  --purple-50:  oklch(97% 0.025 300);
  --purple-100: oklch(93% 0.050 300);
  --purple-200: oklch(85% 0.085 300);
  --purple-300: oklch(74% 0.120 300);
  --purple-400: oklch(62% 0.170 300);
  --purple-500: oklch(52% 0.220 300);
  --purple-600: oklch(44% 0.210 300);
  --purple-700: oklch(36% 0.195 300);
  --purple-800: oklch(27% 0.170 300);
  --purple-900: oklch(18% 0.130 300);
  --purple-950: oklch(11% 0.095 300);
}
```

### Teal / Cyan (Healthcare, Tech, Trust-plus-energy)
```css
:root {
  --teal-50:  oklch(97% 0.025 180);
  --teal-100: oklch(93% 0.050 180);
  --teal-200: oklch(85% 0.085 180);
  --teal-300: oklch(74% 0.125 180);
  --teal-400: oklch(64% 0.165 180);
  --teal-500: oklch(55% 0.185 180);
  --teal-600: oklch(46% 0.175 180);
  --teal-700: oklch(37% 0.160 180);
  --teal-800: oklch(28% 0.140 180);
  --teal-900: oklch(19% 0.110 180);
  --teal-950: oklch(12% 0.080 180);
}
```

---

## Semantic State Scales (Fixed — used for success/warning/error/info)

These are standardized across all projects:

```css
:root {
  /* Success — green family */
  --success-50:  oklch(97% 0.025 142);
  --success-100: oklch(92% 0.050 142);
  --success-500: oklch(52% 0.160 142);
  --success-700: oklch(36% 0.140 142);
  --success-900: oklch(18% 0.095 142);

  /* Warning — amber family */
  --warning-50:  oklch(98% 0.030 72);
  --warning-100: oklch(94% 0.060 72);
  --warning-500: oklch(72% 0.180 72);
  --warning-700: oklch(50% 0.160 72);
  --warning-900: oklch(26% 0.110 72);

  /* Error — red family */
  --error-50:  oklch(97% 0.025 25);
  --error-100: oklch(93% 0.050 25);
  --error-500: oklch(52% 0.220 25);
  --error-700: oklch(36% 0.195 25);
  --error-900: oklch(18% 0.135 25);

  /* Info — blue family */
  --info-50:  oklch(97% 0.020 230);
  --info-100: oklch(93% 0.040 230);
  --info-500: oklch(52% 0.180 230);
  --info-700: oklch(36% 0.160 230);
  --info-900: oklch(18% 0.110 230);
}
```

---

## Dark Mode Scale Mapping

In dark mode, the scale direction inverts for surfaces and text but stays consistent for interactive elements:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Surfaces — use high-step (dark) values */
    --color-bg:       var(--neutral-950);
    --color-surface:  var(--neutral-900);
    --color-surface-2: var(--neutral-800);
    --color-border:   var(--neutral-700);
    --color-border-strong: var(--neutral-600);

    /* Text — use low-step (light) values */
    --color-text-primary:   var(--neutral-50);
    --color-text-secondary: var(--neutral-400);
    --color-text-muted:     var(--neutral-500);

    /* Accent — shift one step lighter for dark bg legibility */
    --color-accent:       var(--[brand]-400);
    --color-accent-hover: var(--[brand]-300);
    --color-accent-soft:  var(--[brand]-900);

    /* Semantic states — lighter variants for dark bg */
    --color-success: var(--success-400);
    --color-warning: var(--warning-400);
    --color-error:   var(--error-400);
    --color-info:    var(--info-400);
  }
}
```

---

## Typography Scale (px + rem)

Always output both px and rem values. Base: 16px = 1rem.

| Token | px | rem | Line-height | Weight | Use |
|---|---|---|---|---|---|
| `--text-xs` | 11px | 0.6875rem | 1.4 | 400 | Labels, captions |
| `--text-sm` | 13px | 0.8125rem | 1.5 | 400 | Secondary body |
| `--text-base` | 15px | 0.9375rem | 1.6 | 400 | Primary body |
| `--text-md` | 16px | 1rem | 1.6 | 400 | Alternate body |
| `--text-lg` | 18px | 1.125rem | 1.5 | 500 | Lead / intro |
| `--text-xl` | 20px | 1.25rem | 1.4 | 500–600 | Section label |
| `--text-2xl` | 24px | 1.5rem | 1.3 | 600 | Card headline |
| `--text-3xl` | 30px | 1.875rem | 1.25 | 600–700 | H3 |
| `--text-4xl` | 36px | 2.25rem | 1.2 | 700 | H2 |
| `--text-5xl` | 48px | 3rem | 1.15 | 700 | H1 |
| `--text-6xl` | 60px | 3.75rem | 1.1 | 700–800 | Display |
| `--text-7xl` | 72px | 4.5rem | 1.05 | 800 | Hero headline |

---

## Pre-Delivery Color Checklist

Before any design system output, verify:

```
COLOR SCALE CHECKLIST
[ ] All 11 steps (50–950) defined for primary brand color
[ ] Neutral scale complete (50–950)
[ ] Semantic roles mapped to specific scale steps
[ ] Dark mode overrides specified
[ ] Text on --color-bg: contrast ≥ 4.5:1 (body), ≥ 3:1 (large/UI)
[ ] Text on --color-accent: contrast ≥ 4.5:1
[ ] Text on --color-success/warning/error backgrounds: contrast verified
[ ] Both px and rem values in typography scale
[ ] Google Fonts import URL included if using web fonts
```
