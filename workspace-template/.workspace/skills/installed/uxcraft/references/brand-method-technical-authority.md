# Brand Method: Technical Authority

Use this skill when building for AI platforms, developer tools, semiconductors, infrastructure, cloud computing, or any context where the buyer/user evaluates credibility through technical depth, performance data, and precision.

Reference brands: NVIDIA, Intel, AMD, Qualcomm, IBM, Cisco (developer), AWS, Vercel, Cloudflare, Stripe (developer docs), GitHub, Figma (developer).

---

## When to Apply This Method

Apply Technical Authority when:
- The audience is developers, engineers, architects, data scientists, or technical decision-makers.
- The product's value is measured in specs, benchmarks, throughput, latency, or compatibility.
- Credibility is demonstrated through diagrams, code, architecture, and precision.
- The primary user actions are: read docs, run a benchmark, integrate, download SDK.

Do not apply when:
- The audience is non-technical business buyers (use Enterprise Trust Hub).
- The product is consumer-facing (use Product Cinema, Playful Familiarity, or Conversion Simplicity).
- The brand leads with campaign/culture storytelling (use Editorial Brand World).

---

## Layout Structure

### Hero
- Technical claim: specific, measurable. "3× faster inference." "Sub-10ms global latency." Never vague.
- Visual: architecture diagram, code snippet, or benchmark chart.
- CTA: "Get Started", "View Docs", "Run in Browser", "Download SDK."
- Sub-CTA: GitHub stars badge, npm install command, version badge.

### Navigation
- Logo left.
- Navigation: Product, Docs, Pricing, Blog, GitHub link, Login, primary CTA.
- Docs always reachable in 1 click from any page.
- Search: prominent, especially on docs pages.
- Dark or light depending on brand — NVIDIA black, Vercel black/white, AWS dark navy.

### Homepage (in order)
1. **Hero** — technical claim, CTA, code/visual proof.
2. **Social proof** — companies using it (logos) or GitHub star count, npm downloads.
3. **Core capabilities** — 3-4 technical capabilities with icons, precise description, link to docs.
4. **Architecture diagram** — how the product fits into a user's stack.
5. **Performance proof** — benchmark chart, speed comparison table, or numbers with methodology.
6. **Integration logos** — compatible tools and platforms.
7. **Code example** — real, runnable snippet showing the simplest useful thing.
8. **CTA section** — "Start building" with install command.

### Docs Pages
- Sidebar navigation: collapsible tree, search, current page highlighted.
- Content: full-width readable column (max 720px), code blocks right or inline.
- Code blocks: syntax highlighting, copy button, language label.
- Table of contents: right sidebar on desktop.
- Breadcrumb: always.
- "Edit this page" link: bottom of every doc.

---

## Color Scheme

### Palette Archetypes

**Dark Technical (NVIDIA, Vercel, Linear)**
- Background: `#0A0A0A` or `#111111`
- Surface: `#1A1A1A` or `#161616`
- Text: `#EDEDED` or `#F0F0F0`
- Secondary text: `#A3A3A3`
- Accent (NVIDIA green): `#76B900`
- Accent (Vercel): `#FFFFFF` or subtle indigo
- Border: `#2A2A2A`
- Code block background: `#1E1E1E` (VS Code Dark-like)
- Syntax: strings `#CE9178`, keywords `#569CD6`, comments `#6A9955`, numbers `#B5CEA8`

**Light Technical (AWS, Stripe, GitHub)**
- Background: `#FFFFFF`
- Surface: `#F6F8FA` (GitHub) or `#F4F6F9`
- Text: `#1A1A1A`
- Secondary text: `#57606A`
- Primary: `#0969DA` (GitHub blue), `#FF9900` (AWS orange), `#635BFF` (Stripe purple)
- Border: `#D0D7DE`
- Code block background: `#F6F8FA`

**Semiconductor / Infrastructure (Intel, Cisco)**
- Background: `#FFFFFF`
- Primary: Intel blue `#0068B5`, Cisco blue `#1BA0D7`
- Surface: `#F5F7FA`
- Text: `#1A1A1A`
- Accent: brand blue
- Code: light mode syntax

### Rules
- Dark surfaces: excellent for developer tools — developers associate dark mode with code environments.
- Accent color: used only for links, CTAs, active states, and syntax highlights.
- Green accents (NVIDIA): only one use per viewport — for performance/success signals.
- Never use gradient backgrounds in technical authority contexts — precision, not decoration.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero claim | 36-56px | 700 | Specific and measurable |
| Hero sub | 17-20px | 400 | Technical context sentence |
| Section headline | 24-32px | 600-700 | |
| Feature title | 18-20px | 600 | |
| Feature body | 14-16px | 400 | |
| Code (inline) | 13-14px | 400 | Monospace |
| Code (block) | 12-14px | 400 | Monospace |
| Benchmark number | 40-60px | 700 | Tabular, brand accent |
| Nav | 13-14px | 500 | |
| Badge | 11px | 600 | Version, status |

### Font Pairings
| Context | Heading | Body | Code |
|---|---|---|---|
| AI / developer | Geist (Vercel), Inter | Inter, Geist | Geist Mono, JetBrains Mono |
| Infrastructure | Helvetica Neue, Inter | Helvetica Neue | Fira Code, Cascadia Code |
| Semiconductor | Intel Clear, or Roboto | Roboto, Inter | Roboto Mono |
| Dev tool (light) | GitHub's Mona Sans, or Inter | Inter | GitHub Monaspace or JetBrains Mono |

### Rules
- Monospace code font must be installed and loaded — never fall back to `monospace` alone.
- Technical numbers (benchmarks): tabular numerals, bold, large — data is the argument.
- Inline code: `background: var(--code-bg)`, `border-radius: 4px`, `padding: 2px 6px`, `font-family: monospace`.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Inline code gaps, badge padding |
| `--space-sm` | 8px | List item gaps, icon margins |
| `--space-md` | 16px | Component padding, form inputs |
| `--space-lg` | 24-32px | Between feature blocks |
| `--space-xl` | 48-64px | Section separation |
| `--space-2xl` | 80-96px | Hero, benchmark section |

- Docs: body content max-width 720px, line-height 1.7 for readability.
- Code blocks: padding 16-20px, line-height 1.5.
- Benchmark section: generous — numbers need room to be impressive.

---

## Motion and Interaction

### Principles
- Minimal animation — technical users are not impressed by flourishes, but are annoyed by delays.
- Benchmark number count-up on scroll: 0 → final value, 800ms ease-out.
- Architecture diagram: SVG with nodes appearing in sequence on scroll (200ms stagger).
- Code block: syntax highlighting is the visual — no animation needed.

### Code Interaction
- Copy button: appears on hover of code block, top-right corner. `aria-label="Copy code"`.
- On copy: button changes to "Copied!" for 2 seconds, then reverts.
- Code line highlights: specific lines highlighted with left border + background for callouts.
- Terminal simulation: character-by-character typing of install command, 50ms per char, 300ms delay before start.

### Performance Benchmark
- Bar chart animation: bars grow from 0 to value, 600ms, ease-out, staggered 100ms.
- Comparison table: scroll-activated row highlights.

### `prefers-reduced-motion`
- Skip all count-ups, diagram sequences, and terminal typing animations.
- Show final state immediately.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Single column. Code blocks: horizontal scroll. Docs sidebar: off-canvas. Hero claim: 28-36px. Benchmark numbers: single column. Architecture diagram: scrollable or simplified. |
| Tablet 768px | Docs: collapsible sidebar. Homepage: 2-column capabilities. |
| Desktop 1024px | Full sidebar on docs. Side-by-side code + description. Architecture diagram full size. |
| Wide 1440px+ | Max-width 1280px. Three-column docs (nav + content + ToC). |

- Mobile code blocks: always horizontal scroll, never wrap — broken code is broken.
- Mobile docs: off-canvas sidebar accessible via hamburger.

---

## Accessibility Requirements

- Code blocks: `<pre><code role="region" aria-label="Code example: [language]">`. Copy button accessible.
- Benchmark charts: provide a data table alternative or aria-described fallback. Never chart-only.
- Architecture diagram: `<figure>` with `<figcaption>` text description of what the diagram shows.
- Terminal animation: provide static text alternative for screen readers.
- Docs navigation: `<nav aria-label="Documentation">`, current page `aria-current="page"`.
- Search: `role="search"`, results `role="listbox"`, keyboard navigable.
- Version badge: `aria-label="Version 3.2.1"`.
- Dark mode: syntax highlighting must maintain 4.5:1 contrast. Verify strings, keywords, and comments all pass.
- Tables (comparison, compatibility): `<th scope="col/row">`, proper header associations.
- "Edit this page" GitHub link: descriptive `aria-label` including page title.

---

## UX Principles for This Method

1. **Claims require proof.** Every marketing claim must be followed by a spec, benchmark, or code example within the same viewport.
2. **Docs are the product.** For developer tools, the documentation experience IS the product experience.
3. **Make the first success fast.** Show the simplest useful thing in the first code block. Developers test before they commit.
4. **Precision over personality.** Numbers over stories. Diagrams over illustrations. Code over description.
5. **Performance is a feature.** A slow documentation site is a credibility problem.
6. **Trust the reader.** Don't oversimplify or over-explain. Technical audiences respect when you give them the detail they need.

---

## Component Specs

### Code Block
```
Background: #1E1E1E (dark) or #F6F8FA (light)
Border-radius: 8px
Padding: 16-20px
Font: JetBrains Mono, Geist Mono, or Fira Code, 13-14px
Line-height: 1.5
Language label: top-left, 11px, all-caps, text-muted
Copy button: top-right, 14px icon, transparent button, hover: surface background
Horizontal scroll: always on overflow, never wrap
Line number gutter: optional, 40px wide, text-muted
Highlight line: left border 3px accent, background rgba(accent, 0.1)
```

### Architecture Diagram
```
Container: full-width, background: var(--surface)
Border-radius: 12px
Padding: 32px
SVG or image: max-width 100%, responsive
Node labels: 11-13px, clean, monospace or sans
Arrows: 1.5-2px, brand accent or muted
Legend: below diagram, 12px, inline color swatches
Figcaption: below, 13px, text-secondary
```

### Benchmark Bar Chart
```
Container: grid of bars
Bar background: var(--surface-2)
Bar fill: brand accent (for "our product"), neutral for competitors
Bar height: 40-48px
Label: left of bar, 13-14px
Value: right of bar, 14-16px bold, brand accent for highest
Source footnote: 12px, text-muted, below chart
```

### Install Command Display
```
Background: var(--code-bg)
Border-radius: 8px
Padding: 12px 16px
Font: monospace, 14px
Prompt: $ symbol, text-muted
Command: text-primary
Copy icon: right side
```

---

## Anti-Patterns to Avoid

- Do not make unverifiable performance claims without benchmarks or methodology.
- Do not show only marketing copy on the homepage — developers will bounce without a code example.
- Do not bury the docs link — technical users look for it first.
- Do not use syntax-error-prone code examples — all code shown must be correct and runnable.
- Do not use line-wrapped code blocks — broken code destroys technical credibility.
- Do not use animations that fire on scroll over benchmark numbers if they require JavaScript that blocks render.
- Do not use "email to see pricing" for developer tools — pricing must be public.
- Do not use generic stock photos of servers, cables, or data centers — use diagrams and screenshots.

---

## QA Checklist

- [ ] Hero claim is specific and measurable — no generic "fast" or "powerful."
- [ ] At least one real, runnable code example on the homepage.
- [ ] Docs link accessible from homepage in one click.
- [ ] Code blocks: horizontal scroll, not wrap, on mobile.
- [ ] Copy button: works, shows "Copied!" confirmation, has `aria-label`.
- [ ] Benchmark chart has data table fallback or `aria-describedby` text.
- [ ] Architecture diagram has `<figcaption>` text description.
- [ ] All dark-mode syntax highlighting passes 4.5:1 contrast.
- [ ] Docs search: keyboard accessible, results announced to screen reader.
- [ ] Version badges have `aria-label`.
- [ ] `prefers-reduced-motion`: no count-up animations, no typing animations.
- [ ] Pricing visible — no "contact sales for pricing" for developer products.
- [ ] Page LCP ≤ 2.5s — technical users will measure this.
