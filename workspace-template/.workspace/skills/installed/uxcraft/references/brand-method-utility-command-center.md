# Brand Method: Utility Command Center

Use this skill when building for ecommerce, logistics, booking platforms, dashboards, admin tools, marketplaces with strong search/filter, or any context where the user's primary goal is to find, track, order, or manage something fast.

Reference brands: Amazon, FedEx, UPS, DHL, Booking.com, Expedia, Walmart, Target, Costco, IKEA, Dell, Domino's.

---

## When to Apply This Method

Apply Utility Command Center when:
- Speed and task completion are the primary UX goals.
- Users arrive with a specific item, destination, order, or task in mind.
- The product catalog or inventory is large (hundreds to millions of items).
- Users compare, filter, track, or manage rather than just browse.

Do not apply when:
- Brand aspiration or emotion drives the visit (use Product Cinema or Editorial Brand World).
- The product is premium/luxury (use Premium Restraint).
- The primary user action is sign-up or subscription (use Conversion Simplicity).

---

## Layout Structure

### Header / Primary Utility Bar
- Full-width header with logo left.
- **Search bar is dominant**: centered or filling most of the header width on desktop, full-width on mobile.
- Search must have: placeholder with example query, clear button, submit, and autocomplete.
- Secondary navigation: categories, account, cart/orders, location — compact, never competing with search.
- Persistent across all pages.

### Homepage Structure (in order)
1. **Primary utility** — search, track, or book above the fold. No exception.
2. **Deal / promotion strip** — thin banner, 1-2 active offers, dismissible.
3. **Category navigation** — visual grid or horizontal scroll of top categories.
4. **Recommended / featured** — personalized or curated product/listing grid.
5. **Trust signals** — delivery times, return policy, security badges (compact).
6. **Secondary categories / browse** — deeper catalog entry points.

### Product / Listing Page
- Sticky filter panel (left on desktop, bottom drawer on mobile).
- Product grid: 3-4 columns desktop, 2 columns tablet, 1-2 columns mobile.
- Each card: image, name (2 lines max), price, rating (star + count), delivery estimate, primary CTA.
- Sort controls: above grid, always visible.
- Pagination or infinite scroll: provide "back to top" and page indicator.

### Product Detail Page
- Breadcrumb at top.
- Images: large primary + thumbnail strip. Zoom on hover (desktop), pinch on mobile.
- Price: large, prominent. Savings amount if applicable.
- Delivery / availability: above fold, always.
- Primary CTA: "Add to Cart" or "Buy Now" — sticky on mobile scroll.
- Specs, reviews, related products: below fold in tabs or sections.

---

## Color Scheme

### Primary Palette by Sub-category

**General Ecommerce / Retail**
- Background: `#FFFFFF`
- Surface: `#F0F2F2` (off-white cards, sidebar)
- Primary text: `#0F1111`
- Secondary text: `#565959`
- Primary CTA: `#FF9900` (Amazon-style) or `#CC0000` (Target), `#0071CE` (Walmart)
- CTA hover: Darken 8%
- Link: `#007185`
- Border: `#D5D9D9`
- Badge/deal: `#CC0000` or `#E31837`

**Logistics / Tracking**
- Background: `#FFFFFF`
- Primary: Brand color (FedEx `#4D148C`/`#FF6600`, UPS `#351C15`/`#FFB500`, DHL `#FFCC00`/`#D40511`)
- Surface: `#F4F4F4`
- Text: `#333333`
- Status indicators: `#00A651` (success), `#E67E22` (in transit), `#C0392B` (exception)

**Booking / Travel**
- Background: `#FFFFFF`
- Primary: `#003580` (Booking.com blue) or `#00355F`
- Accent: `#FEBB02` (deal/highlight)
- Surface: `#F2F2F2`
- Text: `#333333`
- Urgency: `#C0392B` (few left), `#E67E22` (limited time)

### Rules
- Never use dark backgrounds for utility layouts — they slow scanning.
- CTA color must be visually distinct from every other element on the page.
- Urgency / deal badges: use red or orange only; never use urgency color for non-urgent content.
- White background with strong card borders or subtle shadows improves scannability.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Site title / logo | — | — | Image/SVG, not text |
| H1 (page title) | 22-28px | 600-700 | Category or search results title |
| H2 (section title) | 18-22px | 600 | |
| Product name | 14-16px | 400-500 | 2-line clamp |
| Price | 18-24px | 600-700 | Tabular numerals |
| Strikethrough price | 13-14px | 400 | `text-decoration: line-through`, muted color |
| Rating / metadata | 12-13px | 400 | |
| CTA | 13-16px | 600-700 | |
| Body / description | 14-16px | 400 | 1.5 line-height |
| Label / badge | 11-12px | 600-700 | All-caps or bold |

### Font Pairings
| Context | Font |
|---|---|
| General utility | System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| Logistics | Helvetica Neue, Arial, or Inter |
| Travel booking | Circular, Inter, or Source Sans |

### Rules
- Prefer system fonts for performance — users arrive with a task, not a brand appreciation moment.
- Product names must be readable at 2-line clamp. Avoid decorative fonts.
- Price must be the most visually prominent number on a product card.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Badge padding, tight inline gaps |
| `--space-sm` | 8px | Card inner padding, icon gaps |
| `--space-md` | 12-16px | Component padding, form inputs |
| `--space-lg` | 24px | Card gutters, section dividers |
| `--space-xl` | 32-40px | Major section separation |
| `--space-2xl` | 48-64px | Page-level section separation |

- Product grids: 12-16px gap between cards.
- Page padding: 16px mobile, 24px tablet, 40-64px desktop (or centered max-width container).
- Avoid excessive breathing room — utility UX is information-dense by design.

---

## Motion and Interaction

### Principles
- **Instant feedback over animation.** Users are in task mode; delays feel like failures.
- Hover states: subtle background shift, no slow transitions.
- Add-to-cart: brief success micro-animation (cart icon pulse, item count update).
- Skeleton loading: always show skeletons instead of blank areas.

### Key States
| Component | States |
|---|---|
| Search input | Default, focused (border highlight), has-value (show clear button), loading (spinner) |
| Product card | Default, hover (shadow lift + image zoom), loading (skeleton) |
| Add to cart button | Default, hover, loading, success (brief), disabled (out of stock) |
| Filter checkbox | Default, checked, hover, focus, disabled |
| Sort dropdown | Default, open, selected option |
| Tracking step | Completed (filled icon), Active (pulsing dot), Pending (hollow icon) |

### Transitions
- Card hover: `box-shadow 150ms ease`, `transform 150ms ease`
- Button click: `background 100ms ease`, `transform 100ms`
- Dropdown: `opacity 150ms ease`, `transform 150ms ease`
- Never exceed 250ms for task-critical UI transitions.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Single column. Search full-width. Categories horizontal scroll. Sticky add-to-cart bar. Filter as bottom sheet. |
| Tablet 768px | 2-column product grid. Collapsible filter sidebar. |
| Desktop 1024px | 3-4 column grid. Persistent filter sidebar. Full header utility bar. |
| Wide 1440px+ | Max content width 1440px, sidebar fixed, grid expands to 4-5 columns. |

- Mobile: filter panel becomes a full-screen modal or bottom drawer.
- Mobile: sticky "Add to Cart / Proceed" bar fixed to bottom viewport.
- Mobile: search bar always accessible (sticky or easy scroll-to-top).

---

## Accessibility Requirements

- Search input: `<label>` associated via `for`/`id`, or `aria-label`. Autocomplete results use `role="listbox"` with `aria-expanded`.
- Product cards: each card is a landmark. Product name is the accessible label. Price announced. CTA has context: "Add [Product Name] to cart".
- Filters: `<fieldset>` with `<legend>` per group. Checkboxes with visible labels.
- Sort: `<select>` or custom control with `aria-label="Sort by"` and `aria-selected` on option.
- Rating stars: `aria-label="4.5 out of 5 stars, 1,203 ratings"` — never visually-only stars.
- Pagination: `<nav aria-label="Pagination">` with current page `aria-current="page"`.
- Loading states: `aria-busy="true"` on the container while data loads.
- Urgency badges ("Only 2 left"): announce with `aria-live="polite"` if dynamic.
- Touch targets: minimum 44×44px for all interactive elements.
- Focus: visible focus ring on all interactive elements, not removed.

---

## UX Principles for This Method

1. **Search is sacred.** The search bar is the most important element. Never de-prioritize it.
2. **Show don't hide.** Price, delivery estimate, and availability must be on the card — not behind a click.
3. **Scan mode.** Users skim product grids. Design for F-pattern reading: image left, name top, price prominent.
4. **Reduce checkout friction.** Guest checkout, saved addresses, payment tokens. Every field removed increases conversion.
5. **Status visibility.** For logistics: always show where the order/shipment is in real-time.
6. **Honest urgency.** Use scarcity only when true. Fake urgency destroys trust and constitutes a dark pattern.
7. **Recovery is easy.** Undo add to cart, saved carts, continue shopping. Users make mistakes.

---

## Component Specs

### Search Bar
```
Height: 40-48px
Border: 1px solid var(--border), 2px focus
Border-radius: 4px (utilitarian) | 24px (modern)
Background: white
Icon: magnifying glass left (16-20px)
Clear button: right, appears when has-value
Padding: 8px 40px (icon side) 8px 12px
Font: 14-16px
Autocomplete: absolute positioned, full width, max-height 300px, overflow-y scroll
```

### Product Card
```
Width: flexible (grid cell)
Border: 1px solid var(--border)
Border-radius: 4-8px
Padding: 12-16px
Image: aspect-ratio 1/1 or 4/3, object-fit: contain
Product name: 14-16px, 2-line clamp, margin-bottom 4px
Price: 18-22px bold, tabular-nums
Rating: 12-13px, star icons + count
CTA: full-width button, 40px height, brand accent
```

### Status Tracker (Logistics)
```
Steps: horizontal on desktop, vertical on mobile
Active step: filled circle, brand color, pulse animation
Completed: filled check icon, muted brand color
Pending: hollow circle, gray
Step label: 11-12px below/beside icon
Connector line: 2px, colored for completed, gray for pending
```

---

## Anti-Patterns to Avoid

- Do not hide the price until the product page — users need it to scan.
- Do not use dark backgrounds for product grids — reduces readability and scan speed.
- Do not use fake urgency ("Only 3 left!" when 300 are in stock).
- Do not auto-play promotional videos in the product grid.
- Do not use hover-only filters or sort controls — mobile users cannot hover.
- Do not paginate to page 1 after applying a filter — preserve scroll position or result context.
- Do not use captcha on checkout — use it only before purchase if fraud risk is high.
- Do not require account creation before cart or checkout.
- Do not show "out of stock" only after the user has added to cart.

---

## QA Checklist

- [ ] Search returns results within 300ms (or shows skeleton).
- [ ] Product card: price, name, rating, delivery visible without hover.
- [ ] Filter panel: applying a filter immediately updates results (no "Apply" button required unless many simultaneous changes).
- [ ] Sticky add-to-cart bar visible on mobile product detail page scroll.
- [ ] Guest checkout path exists and is accessible without account creation.
- [ ] Tracking status page shows current step, timestamp, and next expected step.
- [ ] All interactive elements have visible focus ring.
- [ ] Rating stars have accessible text alternative.
- [ ] Search input has `<label>` or `aria-label`.
- [ ] Mobile filter is accessible as full-screen modal with close button.
- [ ] No fake urgency copy — verify against live inventory logic.
- [ ] Core Web Vitals: LCP ≤ 2.5s, CLS ≤ 0.1 (product grids must not shift on image load).
