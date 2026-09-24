# Brand Method: Premium Restraint

Use this skill when building for ultra-luxury brands, high-end finance, premium professional services, or any context where the absence of clutter, the quality of typography, and the control of the visual field are the primary brand signal.

Reference brands: Chanel, Hermès, Rolex, Cartier, Dior, Bottega Veneta, Goldman Sachs, Audi (editorial mode), Porsche (brand site), Nespresso.

---

## When to Apply This Method

Apply Premium Restraint when:
- The product commands a significant price premium based on heritage, craft, or exclusivity.
- The brand identity is built on what is NOT shown, not what IS shown.
- The primary emotional outcome is aspiration, desire, and trust in quality.
- Excess, busyness, and bargain signals actively harm the brand.

Do not apply when:
- The product is mass-market or price-competitive.
- The user needs to complete a task quickly (use Utility Command Center).
- The brand uses energy, color, or playfulness as a differentiator.

---

## Layout Structure

### Core Principle: Reduction
- Every element on the page must pass the question: "Does this need to be here?"
- Default answer is no. Add only when the answer is yes.

### Hero
- Full-viewport or near-full-viewport image or video.
- Product or brand world imagery — no UI chrome, no overlays, no text unless absolutely necessary.
- If text: one word or one short phrase, white or black, perfectly typeset, positioned with asymmetrical precision.
- No CTA in the hero, or one ultra-minimal text link ("Discover →").

### Navigation
- Ultra-thin, horizontal: logo centered OR left. Navigation links right (max 4).
- Text-only links, 11-13px, letter-spaced, no underlines.
- No mega-nav. No dropdowns on the homepage hero.
- Disappears on downward scroll, reappears on upward.

### Content Sections
- Each section occupies the full viewport width; most content is centered with massive side margins (24-30% each side on desktop).
- Text-to-content ratio: more whitespace than content by area.
- One idea per section — never combine two things in one section.
- Images: full-bleed alternating left/right OR centered portrait. Never a grid of small images.
- Captions: if used, ultra-small (10-11px), muted, right-aligned or centered.

### Commerce / Product Pages
- Product image: extremely large, centered, no background.
- Price: small, not prominent — the brand is above price anxiety.
- Add to bag: minimal text link or outlined button. Never a filled bright button.
- Product description: sparse, poetic, not a spec sheet.
- Material / craftsmanship section: single long-form paragraph or a few precise sentences.

---

## Color Scheme

### Core Rule: Near-Monochrome

**Luxury Fashion (Chanel, Bottega Veneta)**
- Background: `#FFFFFF` or `#FAF8F5` (warm white)
- Primary text: `#111111` or `#1A1A1A`
- Secondary text: `#888888` (light gray — used with caution, must pass 4.5:1)
- Divider / border: `#E5E5E5`
- Accent: none, or a single heritage color (used once per page maximum)

**Luxury Jewelry / Watches (Rolex, Cartier)**
- Background: `#FAFAF8` (cream-white) or `#0A0A0A` (dark section)
- Primary: cream `#F5F0E8` on dark, near-black `#1C1C1C` on light
- Gold accent: `#C8A96E` or `#D4A017` (used only for jewelry imagery, dividers, or single accent element)
- Deep red: `#8B0000` (Cartier) — for section backgrounds, used maximally once per page

**Premium Beverage / Lifestyle (Nespresso, Moët)**
- Background: `#1C1C1C` or `#FAF5EF`
- Gold: `#C6A55C`
- Cream: `#F5ECD7`
- Text: inverse of background

**Finance / Professional Services (Goldman Sachs)**
- Background: `#FFFFFF`
- Primary: Navy `#001533` or `#002547`
- Text: `#1A1A1A`
- Accent: gold `#C8A96E` only as a single decorative line or icon, never as CTA color

### Color Rules
- Maximum 2 hues active on a single page. Neutrals (black, white, gray, cream) do not count toward this limit.
- Never use: bright primary colors (red/blue/green/yellow) as dominant colors.
- Never use: gradients as backgrounds.
- A single heritage accent color used once — a rule, not a palette.
- Gold: decorative/divider use only, not CTA backgrounds.

---

## Typography

### Core Rule: Typography IS the design.

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Brand/house name | 11-13px | 400-500 | All-caps, tracked +0.15em, nav only |
| Hero text | 20-48px | 300-400 | Light weight, generous tracking |
| Section headline | 18-32px | 300-400 | |
| Body / story copy | 16-18px | 300-400 | Line-height 1.8-2.0, generous |
| Product name | 18-24px | 400-500 | |
| Product description | 14-16px | 300 | Wide line-height |
| Price | 14-16px | 400 | Small, not prominent |
| Caption / credit | 10-11px | 300-400 | Tracked, muted |
| CTA / text link | 11-13px | 400-500 | All-caps, tracked +0.12em |

### Font Pairings
| Brand type | Heading | Body |
|---|---|---|
| Classic French luxury | Didot, Bodoni, or custom | Garamond, Cormorant |
| Contemporary luxury | Helvetica Neue Light, Futura Light | Helvetica Neue, Futura |
| Heritage jewelry/watches | Optima, Trajan Pro | Palatino, Garamond |
| Premium beverage/lifestyle | Libre Baskerville Light | Raleway, Lato Light |
| High-end finance | Mercury Display (editorial) | Mercury Text, or Helvetica Neue |

### Rules
- Never use more than 2 typefaces.
- Default to light weights (300-400) — luxury is effortless.
- Letter-spacing on all-caps labels: `letter-spacing: 0.12em` minimum.
- Line-height on body text: 1.8-2.0 — luxury copy breathes.
- Never use system emoji or icon fonts — only SVG icons, and sparingly.

---

## Spacing System

### Core Rule: Maximum whitespace.

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 6px | Text list gaps |
| `--space-sm` | 16px | Caption to image |
| `--space-md` | 32px | Text block padding |
| `--space-lg` | 64px | Between text elements in a section |
| `--space-xl` | 96-128px | Between sections |
| `--space-2xl` | 160-200px | Hero breathing room, full-viewport spacing |
| `--space-3xl` | 240-300px | Full-page section padding (luxury pages are not short) |

- Page max content width: 800-1000px for text sections. Images: full-bleed or inset 10-15% each side.
- Mobile: scale down 50%, but never sacrifice the sense of emptiness.

---

## Motion and Interaction

### Principles
- No motion unless it is slower and more intentional than you think is necessary.
- Scroll transitions: long, slow fades. Duration 800-1200ms. Ease-in-out.
- No pop, bounce, or scale animations.
- Image load: fade in from white, 600ms.

### Navigation hover
- Underline slides in from left, 200ms. No background fill.

### CTA
- Hover: letter-spacing expands slightly (+0.02em), 200ms. No fill, no scale.

### Product image
- Hover (desktop): subtle secondary image crossfade, 400ms.
- No parallax on text — only on background imagery, subtle (0.05-0.1× difference).

### `prefers-reduced-motion`
- Remove all fade-ins, parallax, and crossfades. All content appears immediately.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Full-bleed images. Side margins 16-24px (not the desktop 24-30%). Hero text: 18-28px. Single-column all. Nav: hamburger with full-screen overlay (imagery background). |
| Tablet 768px | Side margins 8-12%. Side-by-side sections optional. |
| Desktop 1024px | Side margins 16-24%. Full typographic luxury. |
| Wide 1440px+ | Side margins 24-30%. Text column max 800px. Never let content stretch to edges. |

- Never fill the screen edge-to-edge with text — the margins carry the luxury signal.

---

## Accessibility Requirements

- Luxury gray text (`#888888` on `#FFFFFF`) = 3.5:1 — **fails WCAG AA** for body text. Use `#767676` minimum for secondary text (passes at 4.6:1), or use `#555555` for safety.
- Image-only navigation: never acceptable. Every nav link must have text (even if visually hidden with `sr-only`).
- Hero with text: text-to-background contrast must be checked including any scrim or overlay.
- Hover-only product information: all info visible on hover must also be reachable via keyboard focus.
- Slow animations: ensure they don't delay time-sensitive content. Content must be accessible before animation completes.
- Custom cursor: if used, must not be the only hover indicator. Standard interactive affordances required.
- SVG icons: `aria-hidden="true"` if decorative; `title` and `aria-labelledby` if informational.
- Product page: price must be a text element, not an image.

---

## UX Principles for This Method

1. **Absence is the message.** Luxury is what you don't include.
2. **Trust through restraint.** The brand does not need to prove itself with noise.
3. **Typography is the logo.** In the absence of color and decoration, letterforms carry the entire brand.
4. **Speed is luxury too.** A slow page is a dissonant luxury experience. Optimize aggressively.
5. **Commerce is not the point.** The user must desire before they buy. Commerce is the final, quiet step.
6. **Consistency of quiet.** No element breaks the established calm — not a social share button, not a chat widget, not a newsletter popup.

---

## Component Specs

### Navigation (Luxury)
```
Height: 40-48px (minimal)
Logo: centered or left, 80-120px wide
Links: 11-13px, all-caps, letter-spacing 0.12em, font-weight 400
No underline default. Hover: thin underline, transition 200ms
Background: transparent over hero, white/cream on scroll
Transition: background 250ms ease
```

### Text-Link CTA (Not a button)
```
Display: inline
Font: 11-13px, all-caps, letter-spacing 0.12em
Text: "Discover" or "Explore [Collection]" or "Add to bag"
Hover: letter-spacing +0.02em, 200ms
No background, no border (minimal mode)
Or: outlined button with 1px border, no fill, hover: fill with text color, invert text
```

### Image Section
```
Full-bleed: width 100vw, height auto or 80vh
Inset: margin 0 auto, max-width 75-85vw
Object-fit: cover
No rounded corners (luxury is sharp or geometric)
Caption: 10-11px, tracked, right or center aligned, margin-top 12px, color text-muted
```

---

## Anti-Patterns to Avoid

- Do not use promotional badges, price slashes, or urgency labels.
- Do not use rounded pill buttons — luxury uses sharp rectangles or text links.
- Do not use drop shadows on UI elements — they imply web 2.0, not luxury.
- Do not use emojis or informal copy.
- Do not use chatbots with intrusive pop-ups — if chat is needed, make it quiet and opt-in.
- Do not use stock photography — only art-directed or product photography.
- Do not clutter the footer with social media icons, newsletter sign-up, and multiple widget links.
- Do not use system fonts — typography is the primary brand expression tool.
- Do not use gray text that fails WCAG contrast — luxury does not exempt brands from accessibility.

---

## QA Checklist

- [ ] Secondary text color passes 4.5:1 contrast (check `#888888` — likely fails, use `#767676` min).
- [ ] No element in the hero competes visually with the product/brand image.
- [ ] Every navigation link has accessible text (not icon-only).
- [ ] Hover-reveal product info also visible on keyboard focus.
- [ ] Custom cursor (if used) does not break standard interactive affordances.
- [ ] `prefers-reduced-motion`: all animations removed, content immediately visible.
- [ ] No promotional, urgency, or discount UI patterns.
- [ ] No popups, chat widgets, or newsletter banners interrupt the experience.
- [ ] Mobile: nav accessible and functional without degrading luxury feel.
- [ ] Page LCP ≤ 2.5s — luxury pages often have large images. Optimize all images.
- [ ] Price is a text element, not an image.
- [ ] Typography is consistent — no accidental system font fallback visible.
