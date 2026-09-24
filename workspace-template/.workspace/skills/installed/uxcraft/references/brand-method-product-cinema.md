# Brand Method: Product Cinema

Use this skill when building for premium products, hardware, AI products, automotive, luxury goods, creator tools, or any brand where the product itself is the hero.

Reference brands: Apple, Tesla, Mercedes-Benz, Porsche, Rolex, Audi, Sony PlayStation, Samsung, BMW.

---

## When to Apply This Method

Apply Product Cinema when:
- The product has strong visual appeal or engineering craft.
- The brand commands premium pricing and aspiration.
- The primary goal is desire, trust, and direct purchase or configuration.
- The user journey is: discover → desire → configure/buy.

Do not apply when:
- The product is commodity, utility-first, or price-sensitive.
- The primary task is search, compare, or track.
- The brand is playful, enterprise-B2B, or social.

---

## Layout Structure

### Hero Section
- Full-viewport (100vw × 100vh) product image or video.
- Product centered or offset-right with breathing room.
- Minimal overlay: one eyebrow label (optional), one H1 (product name or single claim), one 14-18px supporting sentence, 1-2 CTAs.
- CTA placement: bottom-center or bottom-left, never covering the product.
- No decorative gradients over the product. Let the product speak.

### Scroll Reveal Sections (in order)
1. **Product story / film** — motion reveals or cinematic zoom showing key features.
2. **Key benefit blocks** — 3-4 full-width sections, one benefit each, alternating image/text.
3. **Specifications** — clean table or card grid, minimal chrome.
4. **Ecosystem / accessories** — horizontal scroll or grid of related products.
5. **Social proof** — awards, press quotes, review aggregate. Never more than 3 sources.
6. **Final CTA** — sticky or section-level, repeated from hero.

### Navigation
- Minimal sticky nav: logo left, 3-5 links max, one CTA right.
- On scroll: nav becomes translucent or colored, never opaque-white over hero.
- Mobile: hamburger with full-screen overlay, not a drawer.

### Footer
- Minimal. Legal, links, social icons. Never crowded.

---

## Color Scheme

### Primary Palette (choose one direction)

**Light / Clean Premium**
- Background: `#FFFFFF` or `#F5F5F7`
- Surface: `#FAFAFA`
- Primary text: `#1D1D1F`
- Secondary text: `#6E6E73`
- CTA: Brand accent (e.g., `#0071E3` for tech, `#BB0000` for automotive)
- Border/divider: `#D2D2D7`

**Dark / Cinematic**
- Background: `#000000` or `#0A0A0A`
- Surface: `#161617`
- Primary text: `#F5F5F7`
- Secondary text: `#A1A1A6`
- CTA: High-contrast accent (`#FFFFFF` text on dark, or vivid color button)
- Border/divider: `#2C2C2E`

### Accent Colors by Sub-Category
| Sub-category | Accent examples |
|---|---|
| Consumer tech | Blue `#0071E3`, silver `#8E8E93` |
| Luxury automotive | Red `#CC0000`, gold `#B8860B`, silver |
| Premium watches / jewelry | Gold `#D4A017`, deep green `#1B4332`, heritage red |
| Creator tools | Vivid gradient accent on dark surface |
| Luxury fashion | Cream `#F5F0E8`, gold, black |

### Rules
- Maximum 3 colors in active use at any time (background, text, accent).
- Never use more than one accent color per viewport.
- Gradient: allowed only on the accent CTA button or as a product surface glow, never as a background.

---

## Typography

### Scale
| Role | Size | Weight | Style |
|---|---|---|---|
| Eyebrow | 11-12px | 500-600 | All-caps, tracked +0.08em |
| H1 / Product name | 48-80px | 600-700 | Tight tracking −0.01em to −0.03em |
| H2 / Section headline | 28-40px | 600 | Tight |
| Body / benefit copy | 17-21px | 400 | Normal tracking, 1.6 line-height |
| Spec label | 11-13px | 500 | All-caps, tracked |
| Spec value | 14-17px | 400-500 | Tabular numerals |
| CTA | 14-17px | 500-600 | Normal tracking |

### Font Pairings
| Brand type | Heading | Body |
|---|---|---|
| Consumer tech | SF Pro Display (system), or Inter | SF Pro Text, Inter |
| Luxury automotive | Gill Sans, Optima, or custom serif | Helvetica Neue, Inter |
| Luxury watches/jewelry | Didot, Cormorant Garamond | Futura, Montserrat |
| Premium lifestyle | Playfair Display | Lato, Source Sans |

### Rules
- Never use more than 2 font families.
- Headlines must be large enough to command attention before any image does.
- Avoid system emoji or decorative fonts.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Icon gaps, inline nudges |
| `--space-sm` | 8px | Label spacing, tight stacks |
| `--space-md` | 16px | Component padding |
| `--space-lg` | 32px | Section inner padding |
| `--space-xl` | 64px | Between content blocks |
| `--space-2xl` | 96-128px | Hero breathing room, section separators |
| `--space-3xl` | 160-200px | Full-screen section padding top/bottom |

- Sections must breathe. Minimum 96px padding between major content blocks on desktop.
- On mobile: scale down by ~40%, but never below 24px section separation.

---

## Motion and Interaction

### Scroll-Driven Animation
- Parallax: product image moves at 0.8× scroll speed relative to background.
- Fade-in on scroll: `opacity 0→1`, `translateY 20px→0`, duration 400-600ms, ease-out.
- Never animate text before the user has had 300ms to read it.

### CTA States
| State | Effect |
|---|---|
| Default | Brand accent background, white text |
| Hover | Darken 8-12% or subtle scale `1.02` |
| Active | Scale `0.98`, darken further |
| Focus | 2-3px offset focus ring, brand color or `#0071E3` |
| Loading | Spinner inside button, text hidden or replaced |
| Disabled | 40% opacity, no pointer events |

### Video / Motion Rules
- Autoplay: allowed for hero video if: muted, no audio track, `prefers-reduced-motion` respected.
- Provide poster image fallback.
- Never autoplay audio.
- Reduced motion: replace parallax and scroll animation with instant transitions.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Full-bleed hero image, product fills screen, CTA stacks vertically, type H1 scales to 32-40px |
| Tablet 768px | Two-column benefit layout, nav collapses to hamburger |
| Desktop 1024px | Full layout, scroll animations active |
| Wide 1440px+ | Max content width `1280px` centered, hero fills viewport edge-to-edge |

- On mobile: remove parallax, replace with static scroll.
- On mobile: sticky CTA bar at bottom for primary action.
- Images: use `srcset` or responsive image format (WebP/AVIF). Never serve desktop hero at mobile.

---

## Accessibility Requirements

- Color contrast: minimum 4.5:1 for body text, 3:1 for large text/UI components.
- On dark cinematic surfaces: white text `#F5F5F7` on `#000000` = 21:1 — always passes.
- On hero image overlays: always add a semi-transparent scrim (`rgba(0,0,0,0.4)` minimum) before placing text.
- `prefers-reduced-motion`: wrap all scroll animations in `@media (prefers-reduced-motion: no-preference)`.
- Video: must have `aria-label`, pause control, and `prefers-reduced-motion` stops autoplay.
- CTA buttons: always have visible text label, never icon-only.
- Focus indicators: `outline: 2px solid <accent>; outline-offset: 3px` — never `outline: none` without custom focus style.
- Keyboard: all interactive elements reachable, logical tab order follows visual order.
- Screen reader: hero heading must be an `<h1>`, not a `<div>`. Product name = page title.
- Images: `alt` text describes the product and context, not just "product image".

---

## UX Principles for This Method

1. **Confidence over explanation.** Premium brands do not over-explain. One claim. One proof. Move on.
2. **Product is the hero.** Every layout decision protects the product's visual dominance.
3. **Reduce friction to desire.** The user should feel the product is within reach before they see a price.
4. **CTA placement follows desire.** Place CTA after the moment of maximum desire, not immediately at load.
5. **Consistency of restraint.** Every added element costs attention. Default to removing, not adding.
6. **Configurator UX.** If the product is configurable: show the default beautifully, let the user modify progressively, never show all options at once.

---

## Component Specs

### Hero CTA Button
```
Background: brand accent
Text: contrasting (white on dark, near-black on light)
Padding: 14px 28px
Border-radius: 6-8px (tech) | 0-2px (ultra luxury) | 20px (lifestyle)
Font: 15-17px, weight 500-600
Transition: background 180ms ease, transform 120ms ease
Min-width: 140px
```

### Spec Table
```
Cell padding: 12px 16px
Border: 1px solid var(--border)
Header row: background var(--surface), font-weight 600, font-size 11px all-caps
Value rows: alternating subtle background on hover
Numbers: tabular-nums
```

### Sticky Nav
```
Position: fixed top 0
Height: 44-52px
Backdrop: blur(20px) saturate(180%) with semi-transparent background
Transition: background 200ms ease on scroll
Z-index: 1000
```

---

## Anti-Patterns to Avoid

- Do not clutter the hero with more than 2 CTAs.
- Do not use stock photography — use real product photography or none.
- Do not use discount badges, countdown timers, or urgency copy.
- Do not use carousels in hero — they reduce impact and have poor accessibility.
- Do not use full-width decorative gradients as backgrounds — they cheapen premium perception.
- Do not mix dark and light sections without deliberate contrast logic.
- Do not use multiple accent colors on the same page — pick one.
- Do not put the specification table above the benefit/story section.
- Do not use hover-only navigation — touch users cannot hover.

---

## QA Checklist

- [ ] Hero image/video loads with correct poster/fallback.
- [ ] `prefers-reduced-motion` stops or reduces animation.
- [ ] All text passes 4.5:1 contrast (use browser accessibility audit).
- [ ] Sticky nav visible and usable at all scroll positions.
- [ ] CTA button has visible focus ring.
- [ ] All images have meaningful `alt` text.
- [ ] H1 exists and is the product/brand name.
- [ ] Mobile 375px: hero fills screen, CTA accessible without scroll.
- [ ] Keyboard: tab through all interactive elements without mouse.
- [ ] Screen reader: hero heading, CTA label, product description all announced correctly.
- [ ] No autoplay audio.
- [ ] Page loads in under 3s on 4G (Core Web Vitals: LCP ≤ 2.5s).
