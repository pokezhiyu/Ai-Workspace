# Brand Method: Playful Familiarity

Use this skill when building for food and beverage retail, family brands, toys, children's platforms, casual consumer apps, or any context where the primary emotion is delight, comfort, and ease.

Reference brands: McDonald's, KFC, Burger King, Domino's, Starbucks, LEGO, Nintendo, Coca-Cola, Nestlé, Colgate, Costco.

---

## When to Apply This Method

Apply Playful Familiarity when:
- The brand uses friendly, familiar, or joyful tone as a key differentiator.
- The audience is broad: families, children, casual users, all age groups.
- The primary task is order, find, or buy — but the experience should feel fun, not cold.
- Brand characters, mascots, or iconic imagery are key recognition assets.

Do not apply when:
- The brand is luxury or premium (use Premium Restraint).
- The product is enterprise software or professional tools (use Enterprise Trust Hub or Technical Authority).
- The primary goal is brand storytelling without task completion (use Editorial Brand World).

---

## Layout Structure

### Hero
- Brand imagery dominant: food photography, character/mascot, product in context.
- Warm, bright, inviting — the hero should make the user feel good immediately.
- Headline: short, friendly, direct. "Order Now." "What are you craving?" "Start Building."
- CTA: bold, large, visible — "Order Now", "Find a Store", "Shop Now."
- Promotional strip: thin banner above or below hero with current offer.

### Navigation
- Clear, simple, icons + labels.
- Categories visible in nav or below hero (not hidden in hamburger on desktop).
- Key CTAs in nav: "Order Now", "Delivery", "Store Finder."
- Mobile: bottom navigation bar (food ordering / consumer apps) OR clear hamburger.

### Homepage Sections (in order)
1. **Hero** — brand world, CTA, current promotion.
2. **Featured offers / menu highlights** — 3-4 featured items with prices, large photos.
3. **Order method selection** — Delivery / Takeaway / Dine-in (food brands).
4. **Brand story snippet** — 1-2 paragraphs or a visual story block, friendly tone.
5. **Loyalty / rewards** — app or rewards program teaser.
6. **Location finder** — map or zip code input.

### Menu / Product Page
- Large food photography or product imagery.
- Clear product name, price, description (friendly tone).
- Customization options (size, extras, add-ons): large touch targets, visible choices.
- "Add to Order" / "Add to Cart": prominent, colored, full-width on mobile.
- Allergen info: accessible, visible, not buried.

---

## Color Scheme

### Palette Archetypes

**Fast Food (McDonald's, KFC, Burger King)**
- McDonald's: `#FFC72C` (yellow) + `#DA291C` (red) on white
- KFC: `#E4002B` (red) + `#000000` on white
- Burger King: `#E8611A` (orange/red) + `#502314` (brown) + cream `#F5F0E5`
- Rule: high-energy primaries, white background, CTA uses the brightest brand color.

**Coffee / Comfort (Starbucks)**
- Primary: `#00704A` (green)
- Background: `#FFFFFF` or `#F9F4EE` (warm cream)
- Accent: `#CBA258` (gold, reward tier)
- Text: `#1E3932` (deep green)

**Family Toys (LEGO)**
- Primary: `#F5CC0A` (LEGO yellow) + `#D91F26` (red) + `#006CB7` (blue)
- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Use multiple brand colors in theme/product routing — each theme has its own color.

**Family Food Brands (Nestlé, Colgate)**
- Background: `#FFFFFF`
- Primary: brand blue or red
- Surface: light pastel of primary color at 10-20% opacity
- Text: `#1A1A1A`
- Warm accent: yellow or green for health cues

**Gaming / Family Entertainment (Nintendo)**
- Primary: `#E4000F` (red)
- Background: `#FFFFFF`
- Game character/art provides additional color
- Text: `#1A1A1A`

### Rules
- Colors must be high-energy and identifiable — the brand color is the experience.
- CTA must use the brand's most energetic color.
- White backgrounds prevent color fatigue when using multiple brand colors.
- Never use muted, desaturated tones for primary elements — that signals premium, not playful.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero headline | 32-56px | 700-900 | Friendly bold, may be condensed |
| Section headline | 22-32px | 700 | |
| Product name | 16-20px | 600-700 | |
| Product description | 14-16px | 400 | Friendly tone, short |
| Price | 18-24px | 700 | Tabular numerals, brand accent |
| CTA | 15-18px | 700 | |
| Navigation label | 13-14px | 500-600 | |
| Promo badge | 11-13px | 700-800 | All-caps or bold |

### Font Pairings
| Brand type | Font |
|---|---|
| Fast food | Nunito Black / ExtraBold, Fredoka One, or brand custom |
| Coffee / lifestyle | Lato Bold, Raleway, or circular |
| Family toys | Nunito, Poppins, or Fredoka One |
| Family food/health | Rounded Sans: Nunito, Quicksand, or Poppins |
| Gaming consumer | Custom or Barlow, Exo 2, or Noto Sans Bold |

### Rules
- Use rounded fonts — sharp serifs and thin weights feel cold for playful brands.
- Headlines must command attention immediately — heavy weight, high contrast.
- Never use decorative fonts that sacrifice legibility.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Icon nudges |
| `--space-sm` | 8px | Label margins |
| `--space-md` | 16px | Card padding, button padding |
| `--space-lg` | 24px | Between product cards |
| `--space-xl` | 40-48px | Section separation |
| `--space-2xl` | 64-80px | Hero padding |

- Product grids: 16-20px gutters.
- CTA buttons: generous padding (16px × 32px minimum) — must feel easy to tap.
- Cards: 16px padding, 8-12px border-radius.

---

## Motion and Interaction

### Principles
- Microinteractions should delight — bouncy, friendly, never cold or mechanical.
- Add-to-cart / Order: satisfying animation (checkmark pop, cart count bounce).
- Promo banner: gentle left-right auto-scroll with pause on hover.
- Product card: hop/lift on hover, 150ms.

### Mascot / Character Animation
- Character appears on key moments: empty cart ("Add your first item!"), order success, loyalty milestone.
- Keep to a few frames — simple, not complex.
- `prefers-reduced-motion`: replace all bounce/spring animations with instant transitions.

### Loading
- Skeleton: match card dimensions, shimmer animation.
- Order confirmation: celebratory micro-animation (checkmark or confetti), then settled state.

### Transitions
- Button tap: scale `0.95` on press, bounce back, 150ms spring.
- Card hover: `translateY(-4px)`, `box-shadow` lift, 150ms ease.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Hero: full-width, stacked CTA. Menu: single-column. Bottom nav bar. Large tap targets. Price prominent on card. |
| Tablet 768px | 2-column menu grid. Nav visible. |
| Desktop 1024px | 3-4 column product grid. Full nav visible. |
| Wide 1440px+ | Max-width 1280px. Product grid up to 5 columns. |

- Mobile is the primary experience for food ordering — optimize for thumb reach.
- Bottom nav bar on mobile: 5 items max, icons + labels.
- "Add to Order" button: sticky at bottom of product detail on mobile.

---

## Accessibility Requirements

- Food photography alt text: describe the food item, not "image of food" — e.g., `alt="Big Mac burger with sesame bun, lettuce, cheese, and special sauce"`.
- Menu customization: radio buttons or checkboxes with visible labels. `<fieldset>` + `<legend>` per option group.
- Allergen info: must be a text element, visible by default, not only revealed on hover.
- Bottom navigation: `role="navigation"`, `aria-label="Main navigation"`. Active item: `aria-current="page"`.
- Promotions and badges: always include text content, not just color/icon.
- Character/mascot images: `alt` describes the character's action, not just "mascot."
- Order confirmation: `aria-live="polite"` for success message.
- Touch targets: all buttons and links minimum 44×44px — critical for food ordering on mobile.
- Promo banner: auto-scrolling must pause on focus and on `prefers-reduced-motion`.

---

## UX Principles for This Method

1. **Make the primary task impossible to miss.** Ordering or finding a location is the job — never bury it.
2. **Delight is earned through speed, not decoration.** A fast, frictionless order is more delightful than a bouncy animation on a slow page.
3. **Familiarity is a feature.** Use recognizable patterns (bottom nav, large cards, price prominent) — users already know this language.
4. **Food photography sells.** Invest in imagery. A great photo of food is worth 1000 feature descriptions.
5. **Broad audience.** Someone's grandmother should be able to order without frustration. Do not assume tech literacy.
6. **Loyalty creates habit.** Rewards and loyalty flows are high-value — design them to be simple and visible.

---

## Component Specs

### Menu Product Card
```
Width: flexible
Border-radius: 12px
Background: white
Border: 1px solid var(--border)
Image: 16:9 or square, object-fit: cover, border-radius top
Product name: 16-18px, weight 700, margin-top 12px
Description: 13-14px, text-secondary, 2-line clamp
Price: 16-20px, weight 700, brand accent color
CTA: "Add" button, right-aligned or full-width, brand primary
```

### CTA Button (Playful)
```
Background: brand primary
Text: white, 15-18px, weight 700
Padding: 14-16px 28-36px
Border-radius: 8-12px
Hover: darken 8%, scale 1.02
Active: scale 0.97, darken 12%
Focus: 3px solid brand-darker, offset 2px
Bounce animation on add-to-cart: scale 1.1 → 1.0, 200ms spring
```

### Loyalty Badge / Reward
```
Background: brand accent (gold or contrasting)
Text: 12-13px, bold, white or dark
Border-radius: 6-8px (pill: 20px)
Icon: star or flame, 14px, inline
Padding: 4px 10px
Positioned: bottom-left of product card image (absolute)
```

### Promo Banner
```
Background: brand accent
Text: 13-14px, bold, white or dark
Height: 40-44px
Auto-scroll interval: 4-5s
Pause on hover + focus
Indicator dots: below banner, small (6px), brand light color
```

---

## Anti-Patterns to Avoid

- Do not hide the menu behind 3 clicks.
- Do not use small, light, or thin typography — broad audiences include elderly users.
- Do not use low-contrast food badges or promo text on colorful backgrounds.
- Do not autoplay promotional audio.
- Do not require account creation before viewing the menu.
- Do not use dark patterns for upsells — every "add extra" must be a clear opt-in, not pre-checked.
- Do not use countdown timers for items that are not actually time-limited.
- Do not rely solely on color to convey allergen information.

---

## QA Checklist

- [ ] Primary CTA ("Order Now", "Add to Cart") visible above fold on mobile.
- [ ] Bottom nav (if used): all items labeled, accessible, active state clear.
- [ ] Food photography loads with skeleton placeholder.
- [ ] Menu customization uses `<fieldset>` + `<legend>` with keyboard-navigable options.
- [ ] Allergen info visible as text, not hover-only.
- [ ] All interactive elements ≥ 44×44px touch target.
- [ ] "Add to Order" sticky button on mobile product detail.
- [ ] Loyalty / rewards section reachable within 2 taps.
- [ ] Order confirmation announces success to screen reader (`aria-live`).
- [ ] `prefers-reduced-motion`: all bounce/spring animations replaced with instant transitions.
- [ ] No pre-checked upsell options (dark pattern check).
- [ ] Page loads in under 3s on 4G (food ordering is mobile-first, often on poor connections).
