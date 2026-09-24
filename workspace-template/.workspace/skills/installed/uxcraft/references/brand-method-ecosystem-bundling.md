# Brand Method: Ecosystem Bundling

Use this skill when building for multi-product platforms, product suites, or brands where the value is in the combination of products, not a single product. The goal is to cross-sell, upsell, and create lock-in through integrated value.

Reference brands: Microsoft 365, Adobe Creative Cloud, Apple (hardware + software + services), Google (Search + Maps + Workspace + Cloud), Sony (PlayStation + Electronics + Entertainment), Xbox (Game Pass + Console + Cloud).

---

## When to Apply This Method

Apply Ecosystem Bundling when:
- The brand has 3+ products that work better together than separately.
- The primary value proposition is integration, continuity, or bundled savings.
- The user arrives to find "the right plan" or "what's included."
- The goal is to move a user from one product to the full suite.

Do not apply when:
- The brand has a single flagship product (use Product Cinema).
- The user wants to accomplish one specific task (use Utility Command Center or Conversion Simplicity).
- The brand is enterprise-only (use Enterprise Trust Hub).

---

## Layout Structure

### Hero
- Not a single product — the ecosystem or suite value is the headline.
- Example: "One subscription. Everything creative." (Adobe) or "More with Microsoft 365."
- Hero visual: collage of product interfaces, device ecosystem, or abstract "connected" illustration.
- Primary CTA: "See all plans", "Get the bundle", or "Start free trial" (most inclusive plan).

### Product Overview Section
- Grid or horizontal scroll of product cards: each card = one product in the ecosystem.
- Card: product icon, product name, 1-line description, "Learn more" link.
- Group products by category if 6+: "Creative Tools", "Video + Audio", "Web + Cloud."

### Bundle / Plan Comparison
- Pricing table: 2-4 columns (Individual, Team, Business, Enterprise).
- Each column: plan name, price, primary CTA, included products (checked or listed).
- Highlight recommended plan: border, "Most Popular" badge, slightly elevated.
- Toggle: Monthly / Annual (with savings callout for annual).
- Scrollable on mobile: sticky column headers.

### Integration Showcase
- Diagram or animation showing how products connect.
- Example: "Edit in Photoshop → Preview in XD → Export to After Effects."
- Step-based or flowchart layout.

### Individual Product Deep-Dives
- Accordion or tabbed section: each tab = one product, with key features and screenshot.
- Or: separate product pages linked from the overview cards.

### CTA Section
- "Start with [Product A]" + "Or explore the full suite."
- Include a plan recommendation quiz if 4+ plans (CTA: "Help me choose").

---

## Color Scheme

### Palette Patterns

**Creative Suite (Adobe)**
- Background: `#1B1B1B` dark or `#FFFFFF`
- Primary: `#FF0000` (Adobe red) with product-specific colors as accents
- Surface: `#292929` (dark) or `#F8F8F8` (light)
- Text: `#FFFFFF` (dark) or `#1A1A1A` (light)
- Product colors: each product has signature accent (Photoshop blue, Illustrator orange, Premiere purple)
- CTA: product primary on dark, or brand red on light

**Tech Suite (Microsoft)**
- Background: `#FFFFFF`
- Primary: `#0078D4` (M365 blue)
- Product palette: each Microsoft product uses brand colors (Teams purple, Excel green, Word blue, etc.)
- Surface: `#F4F6F9`
- Text: `#1A1A1A`
- Pricing highlight: `#0078D4` (primary plan)

**Gaming Ecosystem (Xbox)**
- Background: `#000000`
- Primary: `#107C10` (Xbox green)
- Surface: `#1A1A1A`
- Text: `#FFFFFF`
- Accent: green, used for "included" checkmarks, active state, pricing CTA

**Consumer Ecosystem (Apple)**
- Background: `#FFFFFF` (light) or `#000000` (dark sections)
- Text: `#1D1D1F` / `#F5F5F7`
- Product accents: per-product marketing colors (used sparingly)
- CTA: `#0071E3` (Apple blue)

### Rules
- Each product in the ecosystem may have its own accent color — use in product cards/icons only.
- The suite-level brand color dominates — product accents are subordinate.
- Pricing table: highlight column must have clear visual separation (border, elevation, background) — not just a color change.
- Never use 6+ colors on the same screen — product accents appear only in dedicated product sections.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Suite headline | 40-64px | 600-700 | Ecosystem promise |
| Product name (card) | 16-18px | 600 | |
| Product description | 14-15px | 400 | 1-2 lines |
| Plan name | 20-24px | 700 | |
| Price | 32-48px | 700 | Tabular numerals |
| Price period | 14-16px | 400 | "/month" or "/year" |
| Feature list | 14-15px | 400 | Checkmark + text |
| CTA | 14-16px | 600 | |
| Savings badge | 11-12px | 700 | All-caps: "SAVE 40%" |

### Font Pairings
| Context | Font |
|---|---|
| Tech / enterprise suite | Segoe UI, Inter, or system font |
| Creative suite | Adobe Clean, or Inter |
| Gaming | custom brand font or Rajdhani, Barlow Condensed |
| Consumer tech | SF Pro (system) or Inter |

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Checkmark list gaps |
| `--space-sm` | 8px | Product icon margins |
| `--space-md` | 16px | Card padding |
| `--space-lg` | 24-32px | Between product cards |
| `--space-xl` | 48-64px | Between page sections |
| `--space-2xl` | 80-96px | Hero, pricing sections |

- Pricing table: column padding 24-32px. Row: 12-16px vertical padding per row.
- Product card grid: 16-24px gutter. Cards equal height via CSS grid `align-items: stretch`.

---

## Motion and Interaction

### Pricing Toggle (Monthly/Annual)
- Toggle: smooth slide, 200ms ease. Active state clearly indicated.
- Price change: number crossfade or count animation (300ms) — never a jarring instant swap.
- Savings badge: appears on Annual toggle with fade-in.

### Plan Comparison Table
- "Included" checkmark: SVG check, brand color. "Not included": dash or X, muted color.
- Hover row: subtle highlight `rgba(0,0,0,0.04)`.
- Sticky column headers on vertical scroll.

### Product Cards
- Hover: lift shadow, 150ms.
- Click: navigate to product detail section or page.

### Integration Diagram
- Step-by-step animation on scroll: each connection draws itself (SVG stroke animation, 400ms per step).
- `prefers-reduced-motion`: show all steps immediately with no animation.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Product cards: 2×2 grid or single column. Pricing table: horizontal scroll, sticky plan names. Plan toggle: full-width. |
| Tablet 768px | Product cards: 3-column. Pricing: 2-3 columns visible. |
| Desktop 1024px | Full pricing table. Side-by-side product cards. |
| Wide 1440px+ | Max-width 1200px. Pricing table centered. |

- Mobile pricing table: allow horizontal scroll — show 1.5 columns to hint at more.
- Mobile: sticky "Get [Plan Name]" CTA at bottom of pricing page.

---

## Accessibility Requirements

- Pricing table: use `<table>` with `<th scope="col">` for plan names, `<th scope="row">` for feature names.
- "Included" checkmark: `aria-label="Included"` not just a visual check icon.
- "Not included": `aria-label="Not included"`.
- Plan toggle (monthly/annual): `<button role="switch" aria-checked="true/false">` or `<input type="radio">` with `<fieldset>` and `<legend>`.
- Highlighted plan: `aria-describedby` linking to "Most Popular" label.
- Product cards: each card is a link with a descriptive accessible name including product name.
- Savings badge: always a text element, not background-only.
- Price: screen reader announces full price ("12 dollars per month, billed annually").

---

## UX Principles for This Method

1. **Sell the why before the what.** "One place for everything creative" converts before the product list does.
2. **Comparison tables are trust builders.** Transparent feature-by-feature comparison signals confidence.
3. **Recommend a plan.** Users are overwhelmed by 4+ plans. Highlight one as "Best for most people."
4. **Individual entry points.** Let users enter through a single product and discover the suite value.
5. **Bundle savings must be explicit.** Show the per-product cost vs. bundle cost. The math must be obvious.
6. **Never force the full suite.** Some users only need one product — serve them well and upsell contextually.

---

## Component Specs

### Pricing Column (Recommended)
```
Border: 2px solid var(--primary)
Border-radius: 12px
Background: white (light) or var(--surface-raised) (dark)
Box-shadow: 0 8px 32px rgba(0,0,0,0.12)
Badge: "Most Popular" — absolute top-center, background var(--primary), 11px all-caps
Price: 40-48px, weight 700
Period: 14px, weight 400, text-secondary
CTA: filled primary button, full-width
```

### Product Card (Ecosystem Overview)
```
Background: var(--surface)
Border: 1px solid var(--border)
Border-radius: 12px
Padding: 24px
Icon: 40-48px, product accent color
Product name: 17-18px, weight 600, margin-top 12px
Description: 14px, text-secondary, 2-line clamp
"Learn more" link: 13-14px, brand color, arrow icon
```

### Plan Toggle
```
Container: pill shape, background var(--surface)
Active side: filled pill, brand color, white text, 200ms transition
Labels: "Monthly" / "Annually  SAVE 40%"
Savings badge: inline, accent background, bold, 10-11px all-caps
Height: 36-40px, border-radius 20px
```

---

## Anti-Patterns to Avoid

- Do not show all plans without a recommendation — choice overload kills conversion.
- Do not hide savings — if annual is cheaper, show the math prominently.
- Do not use features list jargon that non-technical buyers won't understand.
- Do not require users to navigate 4 levels deep to find what's in a plan.
- Do not use different interaction patterns for the same action across product cards.
- Do not present the pricing table on mobile without horizontal scroll — broken tables are unusable.
- Do not use 6+ product accent colors simultaneously — visual chaos.

---

## QA Checklist

- [ ] Pricing table uses semantic `<table>` with scoped headers.
- [ ] Checkmarks have `aria-label="Included"`.
- [ ] Plan toggle accessible as `role="switch"` or radio group.
- [ ] Recommended plan visually distinct and labeled.
- [ ] Monthly/Annual toggle updates price display without page reload.
- [ ] Savings amount shown on annual toggle.
- [ ] Mobile pricing: horizontal scroll with 1.5 column hint.
- [ ] Product cards link to individual product sections/pages.
- [ ] Integration diagram has text fallback for screen readers.
- [ ] `prefers-reduced-motion`: integration diagram shows all steps immediately.
- [ ] All product icons/images have `alt` text.
- [ ] Price announced correctly to screen readers.
