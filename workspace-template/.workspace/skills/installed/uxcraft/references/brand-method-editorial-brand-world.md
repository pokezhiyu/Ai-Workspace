# Brand Method: Editorial Brand World

Use this skill when building for fashion, luxury lifestyle, sportswear, beverage, entertainment campaigns, or any brand where the world, culture, and story are the primary product.

Reference brands: Nike, Louis Vuitton, Gucci, Chanel, Hermès, Dior, Cartier, Coca-Cola, Pepsi, Red Bull, Heineken, Adidas, Puma.

---

## When to Apply This Method

Apply Editorial Brand World when:
- The brand has a strong cultural identity, campaign world, or emotional territory.
- Photography, art direction, and campaign storytelling are the primary brand assets.
- The user journey is: feel → belong → explore → buy.
- The brand is fashion, sportswear, luxury, beverage, or entertainment.

Do not apply when:
- The primary task is search, track, or compare (use Utility Command Center).
- The brand is enterprise or B2B (use Enterprise Trust Hub).
- Conversion speed is the primary goal (use Conversion Simplicity).

---

## Layout Structure

### Hero / Campaign Opening
- Full-viewport, photography or video-driven.
- Minimal UI chrome — logo, navigation, and one optional CTA are the only non-image elements.
- Campaign headline: bold, large, sometimes a single word or short phrase. Never a product list.
- CTA: secondary-style or none on the first hero — let the image breathe before selling.
- Autoplay video: allowed if muted, with `prefers-reduced-motion` fallback to static poster.

### Page Flow (in order)
1. **Campaign hero** — brand world, emotion, culture.
2. **Product/collection entry** — editorial grid or featured items emerging from campaign imagery.
3. **Brand story / culture section** — athlete, artist, moment, season, or philosophy.
4. **Secondary collections** — horizontal scroll or masonry grid.
5. **Social / community proof** — UGC gallery, press mentions, cultural credentials.
6. **Commerce entry** — subtle but clear: "Shop [Collection]" or "Explore [Season]".

### Navigation
- Minimal fixed or scroll-away nav.
- Logo centered or left.
- Navigation: text-only links, ultra-light weight, never crowded.
- On scroll: nav may disappear, reappear on upward scroll.
- Mobile: hamburger with full-screen overlay featuring campaign imagery as background.

### Collection / Product Grid
- Masonry or editorial grid (not rigid uniform cards).
- Images dominate — minimal text per item.
- Product name and price appear on hover (desktop) or permanently (mobile).
- "Add to bag" or "Shop" appears on hover or as a persistent small link.

---

## Color Scheme

### Palette Archetypes by Brand Type

**Sportswear / Performance (Nike, Adidas, Puma)**
- Background: `#FFFFFF` or `#000000`
- Text: inverse of background
- Accent: campaign color (varies per drop)
- Rule: monochrome base, campaign accent changes seasonally. Product photography provides color.

**Luxury Fashion (LV, Gucci, Chanel, Hermès)**
- Background: `#FFFFFF`, `#FAF8F5` (warm white), or `#0A0A0A`
- Primary text: `#1A1A1A` or `#F5F0E8`
- Accent: heritage color (LV brown `#8B5E3C`/`#D4AF37`, Chanel black, Hermès orange `#E8611A`, Gucci green `#1F5C33`)
- Never use bright primary colors in luxury editorial.

**Luxury Jewelry / Watches (Cartier, Rolex)**
- Background: deep red `#8B0000` (Cartier) or dark green `#1B3A2F` (Rolex) or cream
- Gold accent: `#D4A017` or `#B8960C`
- Text: cream `#F5F0E8` on dark, near-black on light
- Use close-up product photography as hero, not lifestyle.

**Beverage / Culture (Coca-Cola, Pepsi, Red Bull)**
- Hero: brand signature color (Coca-Cola red `#E61830`, Pepsi blue `#004B93`/black, Red Bull blue/silver)
- Background: white or black beneath campaign
- Campaign images provide color contrast — backgrounds stay neutral or brand-primary.

**Fashion Retail (Zara, H&M)**
- Zara: black `#000000` / white `#FFFFFF` — extreme contrast, let product provide color.
- H&M: white with seasonal campaign color accent.

### Rules
- Never introduce new brand colors mid-page — stay within 1-2 established tones.
- Campaign accent color is temporary (seasonal) — built into component vars, not global tokens.
- Photography must provide the emotional color — background palette supports, not competes.
- Low-contrast luxury copy (e.g., gray-on-white) is culturally appropriate but requires WCAG-minimum compliance.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Campaign headline | 64-120px | 700-900 | Ultra-bold or ultra-light depending on brand |
| Sub-headline | 32-48px | 400-700 | |
| Section headline | 22-32px | 400-600 | |
| Body / story copy | 16-18px | 300-400 | Wide line-height 1.7-1.9 |
| Product name | 13-16px | 400-500 | |
| Price | 14-16px | 500-600 | Tabular |
| Caption / credit | 11-12px | 300-400 | Tracked +0.1em |
| Navigation | 12-14px | 400-500 | All-caps, tracked |
| CTA | 12-14px | 500-600 | Underline or subtle button |

### Font Pairings by Brand Type
| Brand type | Heading | Body |
|---|---|---|
| Sportswear | Bebas Neue, Dharma Gothic, or brand condensed | Inter, Helvetica Neue |
| Luxury fashion | Didot, Bodoni, Playfair Display | Garamond, Cormorant, Montserrat Light |
| Luxury watches | Optima, Gill Sans, custom serif | Helvetica Neue Light |
| Beverage / culture | Brand typeface or Impact-style for campaigns | System font for body |
| Contemporary fashion | Helvetica Neue Condensed, Neue Haas | Helvetica Neue Light |

### Rules
- One display typeface maximum per brand.
- Never mix a serif headline with a serif body — pair contrasting type personalities.
- White text on dark campaign imagery requires `text-shadow` or scrim for legibility.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4-6px | Caption gaps, inline elements |
| `--space-sm` | 12px | Nav link spacing |
| `--space-md` | 24px | Card padding, text blocks |
| `--space-lg` | 48px | Between editorial sections |
| `--space-xl` | 80-96px | Major story section separation |
| `--space-2xl` | 120-160px | Hero breathing room |
| `--space-3xl` | 200-240px | Full-screen campaign breathing room |

- Editorial brands use whitespace aggressively — it signals luxury, curation, and confidence.
- Product grids: 20-32px gap. Editorial masonry: irregular gaps for art-direction feel.
- Mobile: reduce by 50% but never lose the sense of breathing room.

---

## Motion and Interaction

### Scroll and Reveal
- Images fade and scale in: `opacity 0→1`, `scale 1.03→1`, duration 600-800ms, ease-out.
- Campaign text reveals: staggered word or line animation, 50ms stagger, 500ms per element.
- Parallax: background image scrolls at 0.7× rate — creates depth without distraction.
- Cursor: custom cursor (dot, circle, brand symbol) on desktop for premium fashion brands.

### Hover
- Product images: secondary image crossfade on hover (front view → detail/model view).
- Collection items: overlay appears with product name + price + add-to-bag.
- Navigation links: underline slide-in or letter-spacing shift.

### Transitions
- Page transitions: cross-fade or slide, 300-400ms ease-in-out.
- Section transitions: wipe or fade, never instant cut unless brand is minimalist.

### `prefers-reduced-motion`
- Replace all scroll animations with instant opacity transitions.
- Disable custom cursor.
- Disable parallax.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Stack all editorial content. Full-width hero image. Typography scales down (campaign headline 36-48px). Nav: full-screen overlay. Product grid: 2 columns or single-column film strip. |
| Tablet 768px | 2-column editorial grid. Nav collapses. |
| Desktop 1024px | Full editorial layout, masonry grid, parallax active. |
| Wide 1440px+ | Hero fills viewport. Max-width on text columns (800-1000px) to preserve readability. |

- Mobile: disable hover-reveal product details — show product name and price by default.
- Mobile: replace parallax with static images.
- Mobile: CTA must be reachable without pinch or complex navigation.

---

## Accessibility Requirements

- Low-contrast luxury typography (e.g., light gray on white) must still meet 4.5:1 minimum ratio. If brand demands lower contrast, apply only to decorative, non-essential copy — never to CTAs, product names, or prices.
- Campaign images with text overlay: **always add a scrim** (minimum `rgba(0,0,0,0.35)` or equivalent) before placing text.
- Custom cursor: must not be the only indicator of interactive state. Underlines, outlines, or color changes required in addition.
- Autoplay video: muted, `prefers-reduced-motion` stops it, pause button always visible.
- Hover-reveal product details: provide same content accessible via keyboard focus.
- Masonry grid: ensure tab order follows reading order (top-left to bottom-right), not DOM insertion order if CSS reorders.
- Image-heavy pages: always use `alt` text that describes the scene or product, not just "campaign image".
- Navigation overlay: trap focus within overlay when open. `Escape` closes it.
- Language of campaign copy: if multilingual, use `lang` attribute on copy blocks.

---

## UX Principles for This Method

1. **The brand world is the product.** Sell the identity before the item.
2. **Restraint is luxury.** The fewer elements on screen, the more premium the perception.
3. **Photography is the primary design element.** Every layout decision serves the image.
4. **Commerce is a destination, not the landing.** Guide users to shop through desire, not aggressive CTAs.
5. **Seasonal freshness.** The page should feel like a new campaign with each collection — build for easy content refresh.
6. **Speed of desire.** Even editorial pages must load quickly. A slow luxury page destroys the premium feeling.

---

## Component Specs

### Editorial Hero
```
Height: 100vh minimum (can be taller for immersive)
Image: object-fit: cover, object-position: center
Scrim: linear-gradient for text readability
Campaign headline: absolute positioned, z-index above image
CTA: absolute or below hero, never covering face/product center
```

### Product Hover Overlay
```
Trigger: CSS :hover + :focus-within
Overlay: rgba(0,0,0,0.4) over image
Content: product name (14-16px white), price (14px white), CTA ("Add" or "Shop")
Transition: opacity 200ms ease
Keyboard: same content revealed on :focus-within
```

### Editorial Grid (Masonry-style)
```
CSS Grid: grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
For masonry: grid-template-rows: masonry (or JS solution)
Gutter: 2-3% or 20-32px
Item border-radius: 0 (editorial) | 4px (softer brand)
No card borders — let whitespace and images define items
```

---

## Anti-Patterns to Avoid

- Do not use stock photography — editorial brands live and die by authentic imagery.
- Do not add multiple CTAs to the campaign hero — one message, one direction.
- Do not use countdown timers unless the brand explicitly uses urgency (e.g., drops/limited editions).
- Do not use rigid uniform grids — they destroy editorial feel.
- Do not clutter the page with social share buttons, chat widgets, or promo banners at load.
- Do not use Comic Sans, Impact, or novelty typefaces unless the brand identity demands it.
- Do not copy a brand's exact trademark color combination (e.g., LV monogram brown + gold pattern).
- Do not remove all contrast in pursuit of minimalism — accessibility is non-negotiable.

---

## QA Checklist

- [ ] Campaign hero image loads with correct poster/fallback.
- [ ] Text on images passes 4.5:1 contrast (include scrim in measurement).
- [ ] `prefers-reduced-motion` replaces animations with instant transitions.
- [ ] Hover-reveal product details are also accessible via keyboard focus.
- [ ] Navigation overlay traps focus, `Escape` closes it.
- [ ] Masonry grid tab order is logical and readable.
- [ ] All images have meaningful `alt` text.
- [ ] Mobile: product name and price visible without hover.
- [ ] No autoplay audio.
- [ ] Page loads in under 3s on 4G (LCP ≤ 2.5s — use lazy loading for below-fold images).
- [ ] Custom cursor does not break keyboard navigation.
- [ ] No brand trademark colors, logos, or exact layouts copied from reference brands.
