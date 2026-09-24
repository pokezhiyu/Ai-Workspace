# Design System Schema

This file defines the portable 9-section design system format used by UI/UX Master. Every project should have a `.ui-ux-memory.md` at its root that follows this schema. Every design output reads from this schema — when it's populated, no design decision needs to be re-established.

Use this as the template for creating or updating a project's design system record.

---

## How to Use

When starting work on a project:

1. Look for `.ui-ux-memory.md` at the project root.
2. If it exists: read all 9 sections before designing. Follow the schema as the source of truth.
3. If it doesn't exist: create it using this template. Fill in what is known. Mark unknown sections with `[not yet defined]`.
4. After each design session: update the schema with any new durable decisions (new component pattern, new color token, new spacing rule).
5. The schema is **living documentation** — it grows with the project.

---

## The 9-Section Schema

---

### Section 1 — Color

```markdown
## Color

### Palette
| Role | Token | Hex | OKLch | Usage |
|------|-------|-----|-------|-------|
| Background | --color-bg | #FAFAFA | oklch(99% 0.002 264) | Page background |
| Surface | --color-surface | #F4F4F6 | oklch(97% 0.003 264) | Card, panel backgrounds |
| Surface raised | --color-surface-2 | #EDEDF0 | oklch(94% 0.004 264) | Hover states, nested surfaces |
| Border | --color-border | #DDDDE3 | oklch(88% 0.005 264) | Dividers, input borders |
| Text primary | --color-text-primary | #1A1A22 | oklch(15% 0.010 264) | Body copy, headings |
| Text secondary | --color-text-secondary | #666677 | oklch(45% 0.010 264) | Meta, captions, labels |
| Text muted | --color-text-muted | #999AAA | oklch(65% 0.008 264) | Placeholders, disabled |
| Accent / Brand | --color-accent | #4361EE | oklch(52% 0.18 264) | CTAs, links, active states |
| Accent hover | --color-accent-hover | #3451DE | oklch(45% 0.18 264) | Hover on accent |
| Success | --color-success | #1A7F5A | oklch(52% 0.16 142) | Positive states |
| Warning | --color-warning | #D4A017 | oklch(72% 0.18 72) | Caution states |
| Error | --color-error | #C0392B | oklch(52% 0.22 25) | Error states |
| Info | --color-info | #0072CE | oklch(52% 0.18 230) | Informational states |

### Dark Mode
[yes / no — if yes, include dark-mode token overrides]

### Color Rules
- Primary brand color: [token] — used for CTAs, active navigation, key links only.
- Maximum accent colors active simultaneously: [number].
- Gradient: [allowed / not allowed — if allowed, describe usage].
- Background: [light / dark / both].
```

---

### Section 2 — Typography

```markdown
## Typography

### Fonts
| Role | Family | Fallback | Weights loaded |
|------|--------|----------|----------------|
| Display / heading | [name] | [fallback] | [400, 600, 700] |
| Body | [name] | system-ui, sans-serif | [400, 500] |
| Mono / code | [name] | monospace | [400] |

### Scale
| Token | Size | Line-height | Weight | Tracking | Use |
|-------|------|-------------|--------|----------|-----|
| --text-xs | 11px | 1.4 | 400 | normal | Captions, labels |
| --text-sm | 13px | 1.5 | 400 | normal | Secondary body |
| --text-base | 15px | 1.6 | 400 | normal | Primary body |
| --text-lg | 17px | 1.6 | 400-500 | normal | Lead text |
| --text-xl | 20px | 1.4 | 500-600 | -0.01em | Section headings |
| --text-2xl | 24px | 1.3 | 600 | -0.02em | Page subheadings |
| --text-3xl | 32px | 1.2 | 600-700 | -0.02em | H2 |
| --text-4xl | 40-56px | 1.1 | 700 | -0.03em | H1, hero |

### Typography Rules
- Heading font pairing with body: [describe].
- Max heading size at desktop: [size].
- Max heading size at mobile: [size].
- Line-length (prose): max [60-72]ch.
- Minimum body font size: [14px].
```

---

### Section 3 — Spacing

```markdown
## Spacing

### System
Base unit: [4px / 8px]

| Token | Value | Use |
|-------|-------|-----|
| --space-1 | 4px | Micro gaps, icon padding |
| --space-2 | 8px | Tight stacks, inline gaps |
| --space-3 | 12px | Dense component padding |
| --space-4 | 16px | Standard component padding |
| --space-6 | 24px | Card padding, section inner |
| --space-8 | 32px | Between components |
| --space-12 | 48px | Section separation |
| --space-16 | 64px | Major section gaps |
| --space-24 | 96px | Hero / CTA section padding |

### Spacing Rules
- Component padding: [token].
- Card inner padding: [token].
- Page horizontal padding (mobile): [token].
- Page horizontal padding (desktop): [token].
- Grid gutter: [token].
- Max content width: [px].
```

---

### Section 4 — Layout

```markdown
## Layout

### Grid
| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile 375px | 4 | 16px | 16px |
| Tablet 768px | 8 | 20px | 24px |
| Desktop 1024px | 12 | 24px | 40px |
| Wide 1440px+ | 12 | 24px | auto (centered) |

### Container
- Max content width: [px].
- Centered: yes.
- Full-bleed sections: [allowed / not — describe when].

### Responsive Rules
- Mobile-first: [yes / no].
- Primary breakpoints: [list].
- Touch targets minimum: 44×44px.
- Any mobile-specific patterns: [describe].

### Brand Method
- Primary design method: [Product Cinema / Utility Command Center / Editorial Brand World / etc.]
- Reference file: `references/brand-method-[name].md`
```

---

### Section 5 — Components

```markdown
## Components

List all established component patterns. For each component, record the key decisions so they are not re-decided.

### Button
- Primary: background [token], text [token], border-radius [token], padding [token].
- Secondary: [outlined / ghost / filled-muted].
- Sizes: [sm / md / lg].
- Loading state: [spinner inside / text change].
- Disabled: [opacity / different color].
- Focus: [ring spec].

### Input / Form
- Border: [token], focus border: [accent token].
- Label: above or floating?
- Error state: [border color + message below].
- Helper text: [below input, muted color].
- Required marker: [asterisk / word].

### Card
- Background: [token].
- Border: [token] or shadow: [token].
- Border-radius: [token].
- Padding: [token].
- Hover state: [describe].

### Navigation
- Type: [sticky / scroll-away / sidebar / bottom-nav].
- Background: [on-scroll behavior].
- Mobile: [hamburger / bottom-nav / other].

### [Additional components — add as they are established]
```

---

### Section 6 — Motion

```markdown
## Motion

### Principles
- Motion philosophy: [purposeful / minimal / expressive / none].
- Default easing: [ease-out / ease-in-out / spring].
- Default duration: [150ms / 200ms / 300ms].

### Token Set
| Token | Value | Use |
|-------|-------|-----|
| --duration-instant | 100ms | Immediate feedback (button tap) |
| --duration-fast | 150ms | Hover states, small transitions |
| --duration-normal | 250ms | Panel open/close, dropdown |
| --duration-slow | 400ms | Page transitions, large reveals |
| --duration-slower | 600ms | Scroll-triggered animations |
| --ease-default | cubic-bezier(0.16, 1, 0.3, 1) | Standard ease-out |
| --ease-spring | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful/springy |
| --ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | Symmetric transitions |

### Reduced Motion
- All animations wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Reduced motion fallback: [instant transition / static].

### Allowed Animations
[List what is allowed — e.g., fade-in on scroll, hover lifts, page transitions]

### Forbidden Animations
[List what is not allowed — e.g., no autoplay videos with sound, no infinite spinning logos]
```

---

### Section 7 — Voice and Copy

```markdown
## Voice and Copy

### Brand Voice
- Tone: [formal / conversational / technical / playful / authoritative].
- Person: [first person "we" / second person "you" / impersonal].
- Reading level: [general / professional / expert].

### Copy Rules
- Headlines: [sentence case / title case / all-caps].
- CTA copy: [imperative verb first — "Start free trial" not "Free trial"].
- Error messages: [describe the problem + say what to do — never just "Error"].
- Empty states: [explain why it's empty + offer an action — never just "No results"].
- Loading states: [describe what's loading — "Loading your projects…"].
- Confirmation messages: [specific — "Project saved" not just "Saved"].

### Forbidden Copy Patterns
- No: "Seamlessly", "Effortlessly", "Powerful yet simple", "All-in-one".
- No invented metrics without a source.
- No lorem ipsum in high-fidelity output.
- No "Click here" as link text.

### Localization
- Primary language: [language].
- RTL support: [yes / no].
- Key markets for i18n: [list if known].
```

---

### Section 8 — Brand

```markdown
## Brand

### Identity
- Brand name: [name].
- Tagline: [tagline or "not defined"].
- Brand personality: [3 adjectives].
- Brand anti-personality: [3 things the brand is NOT].

### Assets
- Logo: [path or "not yet available"].
- Favicon: [path or "not yet available"].
- Icon set: [Lucide / Heroicons / Phosphor / custom].
- Illustration style: [describe or "none"].
- Photography style: [describe or "none"].

### Brand Extraction
- Source: [URL / file / "not extracted"].
- Extracted on: [date or "not yet"].
- Confidence: [HIGH / MEDIUM / LOW / "not extracted"].
- Notes: [any caveats or approximations].

### Visual Direction (if no brand)
- Active direction: [Neutral Modern / Dark Technical / Warm Editorial / Bold Energetic / Calm Trust / "not selected"].
- Status: [provisional — update when brand is confirmed / confirmed].
```

---

### Section 9 — Anti-Patterns

```markdown
## Anti-Patterns

Record project-specific patterns that have been tried and rejected, in addition to the universal list in `references/output-quality-gates.md`.

### Visual Anti-Patterns
- [Pattern]: [Why it was rejected for this project].
- [Add as patterns are identified and rejected].

### Copy Anti-Patterns
- [Pattern]: [Why].

### UX Anti-Patterns
- [Pattern]: [Why].

### Technical Anti-Patterns
- [Pattern]: [Why — e.g. "No inline styles — we use CSS tokens only"].

---
*Last updated: [date]*
*Updated by: [agent session or designer name]*
```

---

## Schema Maintenance Rules

1. **Read before design.** Always read the schema before starting any new screen or component on an existing project.
2. **Write after design.** After any session that establishes a new durable decision, update the relevant section.
3. **Tokens must be consistent.** If a new token is added to the schema, it must be consistent with existing tokens. No ad-hoc magic numbers.
4. **Anti-patterns are permanent.** Once a pattern is added to Section 9, it stays unless explicitly reversed by the user.
5. **Version the schema.** Update the "Last updated" line at the bottom of Section 9 after every meaningful change.
6. **The schema is not a spec.** It records decisions, not deliverables. Component specs and screen specs live in `templates/component-spec.md` and `templates/ui-ux-brief.md`.

---

## MASTER + Page Overrides Hierarchy

For multi-page products, use a hierarchical design system file structure. This prevents global tokens from being re-established per page and allows page-specific deviations without polluting the master.

### File Structure

```
design-system/
├── MASTER.md          ← Global source of truth (all 9 sections)
└── pages/
    ├── landing.md     ← Landing page overrides only
    ├── dashboard.md   ← Dashboard overrides only
    ├── checkout.md    ← Checkout overrides only
    ├── onboarding.md  ← Onboarding overrides only
    └── [page].md      ← Any page-specific deviations
```

### MASTER.md

Contains the full 9-section schema. This is the global design system. Every page inherits from it unless overridden.

### pages/[page].md

Contains **only the deviations** from the master. Do not repeat tokens from MASTER.md — only write what is different.

**Example `pages/dashboard.md`:**
```markdown
# Dashboard — Design System Overrides

Inherits from: design-system/MASTER.md

## Color Overrides
- --color-bg: var(--neutral-950)  ← Dark mode for dashboard only
- --color-surface: var(--neutral-900)
- --color-text-primary: var(--neutral-50)

## Layout Overrides
- Grid: sidebar (240px fixed) + main content (fluid)
- No hero section
- Compact spacing: --space-4 for most gaps (vs. --space-6 in master)

## Component Overrides
- Nav: Left sidebar (not top nav from master)
- Cards: Dense data variant — --space-4 inner padding (vs. --space-6)
```

### Retrieval Protocol

When building any page, always follow this lookup order:

```
1. Check if design-system/pages/[current-page].md exists.
2. If YES → Read the page file. Its rules override the master for this page.
3. Read design-system/MASTER.md for everything NOT overridden in the page file.
4. Combined rules = the complete design system for this page.
```

**Context-aware prompt pattern:**
```
I am building the [Page Name] page.
Please read design-system/MASTER.md for the global design system.
Also check if design-system/pages/[page-name].md exists.
If it exists, apply its rules as overrides on top of the master.
If not, use MASTER.md exclusively.
```

### When to Create a Page Override

Create a page override file when:
- The page uses a significantly different layout (sidebar nav, full-bleed, etc.)
- The page has a different color scheme (dark dashboard on a light-mode product)
- The page needs denser or more spacious spacing than the master
- The page has unique component variants not used elsewhere

Do **not** create a page override for:
- Minor copy differences
- Individual component states
- One-off color tweaks that should be global tokens anyway
