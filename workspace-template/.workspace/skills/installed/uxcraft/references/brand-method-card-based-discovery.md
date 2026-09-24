# Brand Method: Card-Based Discovery

Use this skill when building for marketplaces, media platforms, travel aggregators, content libraries, product catalogs, rental platforms, or any context where the user browses, saves, and discovers from a large collection.

Reference brands: Airbnb, YouTube, Spotify, Netflix, Disney+, LEGO, Nintendo, Booking.com listings, Etsy, Pinterest.

---

## When to Apply This Method

Apply Card-Based Discovery when:
- The product is a catalog, marketplace, or content library.
- Users browse, save, filter, and compare rather than searching for one specific item.
- The value proposition is breadth: "there's always something for you."
- Discovery and serendipity are core to the experience.

Do not apply when:
- Users arrive with a specific known item in mind (use Utility Command Center).
- The brand has a single product hero (use Product Cinema).
- The primary goal is subscription sign-up (use Conversion Simplicity).

---

## Layout Structure

### Hero / Entry Point
- Not a full-screen hero — the card grid IS the value proposition.
- Compact hero: search bar, category tabs, or personalized greeting with immediate content below.
- Alternative: carousel or featured editorial band (1-3 items), then immediate card grid.
- Call to action: "Browse [Category]" or personalized "Continue Watching / Listening / Exploring."

### Card Grid
- Primary layout pattern.
- Grid: responsive, 2-6 columns depending on card type and screen.
- Card rows: grouped by category, mood, recommendation engine, or curator picks.
- Section headings above each row with optional "See all →" link.
- Horizontal scroll rows for mobile (swipe gesture expected).

### Filter and Sort Controls
- Persistent or collapsible filter panel.
- Filter types: category, price/rating range, location, date, availability, mood/genre.
- Active filter chips shown above results — easy to clear individually or all.
- Sort: relevance, price, rating, newest, most popular.

### Card Types
Define at least one primary card type per context:
- **Content card**: thumbnail (16:9 or 1:1), title, creator/source, metadata (duration, views, rating).
- **Product card**: image, name, price, rating, badge (deal, new, bestseller).
- **Place/listing card**: image (4:3), name, location, rating, price/night, favorite icon.
- **Media card**: album art, title, artist/show, play button.

### Detail Page
- Hero: large image or media player.
- Primary action: "Play", "Book", "Add to Cart", "Save."
- Metadata: ratings, description, related tags.
- Recommendation section: "More like this", "Because you watched/liked."
- Reviews (if applicable): summary + individual reviews.

---

## Color Scheme

### Palette by Sub-category

**Travel Marketplace (Airbnb)**
- Background: `#FFFFFF`
- Primary: `#FF385C` (coral/brand)
- Surface: `#F7F7F7`
- Text: `#222222`
- Secondary text: `#717171`
- Border: `#DDDDDD`
- Map accent: brand coral
- Favorite icon: `#FF385C`

**Streaming / Media (Netflix, Spotify)**
- Background: `#141414` (Netflix) or `#121212` (Spotify)
- Surface: `#1E1E1E` or `#282828`
- Primary text: `#FFFFFF`
- Secondary text: `#B3B3B3`
- Accent: `#E50914` (Netflix red) or `#1DB954` (Spotify green)
- Progress bar: accent color on dark track

**Family / Toys (LEGO, Disney, Nintendo)**
- Background: `#FFFFFF`
- Primary: Brand color (LEGO yellow `#FFD700` / red, Nintendo red `#E4000F`)
- Surface: `#F8F8F8`
- Text: `#1A1A1A`
- Secondary text: `#666666`
- Card border: `#EEEEEE`
- Accent / CTA: brand primary

**General Marketplace (Etsy)**
- Background: `#FFFFFF`
- Primary: `#F1641E` (Etsy orange)
- Surface: `#F4F4F4`
- Text: `#222222`

### Rules
- Dark surfaces: Spotify and Netflix — vivid accent pops against dark. Use sparingly.
- Light surfaces: marketplaces, travel — clean white lets imagery drive color.
- Card backgrounds must be neutral — let card content (images) provide color energy.
- Favorites / save icon: always high-contrast so users can find it.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Section heading | 18-24px | 600-700 | |
| Card title | 14-16px | 500-600 | 1-2 line clamp |
| Card metadata | 12-14px | 400 | Duration, views, rating |
| Price | 14-16px | 600 | Tabular numerals |
| Badge | 10-12px | 600-700 | All-caps, high contrast on brand color |
| Filter label | 13-14px | 500 | |
| CTA | 14-16px | 600 | |
| Hero headline (if any) | 28-40px | 700 | |

### Font Pairings
| Context | Font |
|---|---|
| Travel / marketplace | Cereal (Airbnb), Circular, or Inter |
| Streaming dark | Netflix Sans, or Inter/Roboto |
| Music | Circular, Montserrat, or Nunito |
| Family/toys | Nunito, Poppins, or Fredoka One |

### Rules
- Card titles must be readable at small sizes — minimum 14px.
- Use `line-clamp` to keep card grids uniform — never let one card blow the layout.
- Price: bold, tabular numerals, never ambiguous position on card.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Icon nudges, badge padding |
| `--space-sm` | 8px | Card inner gaps |
| `--space-md` | 12-16px | Card padding |
| `--space-lg` | 20-24px | Grid gutters |
| `--space-xl` | 32-40px | Section separation (heading to grid) |
| `--space-2xl` | 48-64px | Between major content sections |

- Grid gutter: 16-24px between cards. Smaller for media, larger for travel listings.
- Section separation: 32-48px between category rows.
- Cards must have consistent height within a row (use fixed aspect ratio on images).

---

## Motion and Interaction

### Card Interactions
- Hover: subtle shadow lift `box-shadow: 0 4px 16px rgba(0,0,0,0.15)`, image zoom `scale(1.03)` transition 200ms.
- Favorite/save button: heart icon fill animation on click (scale 1.2 → 1.0, 150ms).
- Play button overlay: appears on card hover with opacity transition.
- Carousel/row scroll: smooth scroll with momentum. Show scroll indicator or arrows at edges.

### Loading
- Always use skeleton screens for card grids — never blank areas.
- Skeleton: match exact card dimensions. Animate shimmer gradient left to right.
- Infinite scroll: load next batch 200px before viewport bottom. Show spinner at bottom.

### Transitions
- Page navigation: instant load with skeleton → content fade-in. No full-page loading spinners.
- Filter apply: instant result update with skeleton transition, never full page reload.
- Media player appear: slide-up from bottom (mobile) or smooth expand (desktop).

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Single column (1-2 cards wide). Horizontal scroll rows. Filter: bottom sheet. Search: full width. |
| Tablet 768px | 2-3 column grid. Horizontal scroll or pagination. Collapsible filter sidebar. |
| Desktop 1024px | 3-5 column grid. Persistent or toggle filter panel. |
| Wide 1440px+ | 4-6 columns for media/product cards. Max-width content container. |

- Mobile: horizontal scroll card rows (Netflix-style) are expected and usable.
- Mobile: filter is a full-screen bottom sheet with apply/clear buttons.
- Mobile: card images must be large enough to see detail (min 140px width).

---

## Accessibility Requirements

- Card: each card is a single interactive unit. Use `<article>` or `<li>`. Primary action (title link) is the main focus target.
- Favorite button: `aria-label="Save [Item Name]"` or `aria-pressed="true/false"`.
- Play button: `aria-label="Play [Title]"`.
- Rating stars: `aria-label="4.2 out of 5 stars"`.
- Carousel/row: `role="region"` with `aria-label="[Category Name]"`. Left/right scroll buttons keyboard accessible.
- Infinite scroll: announce new results with `aria-live="polite"` — "12 more results loaded."
- Filter: `<fieldset>` + `<legend>` per group. Active filters: each chip has a remove button with `aria-label="Remove [filter name] filter"`.
- Image thumbnails: `alt` describes the content (movie title, product name, property name).
- Dark streaming UI: ensure text-on-image thumbnails meet contrast. Provide text overlays only with scrim.
- Touch targets: card images, titles, and favorite buttons all ≥ 44×44px on mobile.

---

## UX Principles for This Method

1. **Discovery over search.** Browsing should feel rewarding — "I didn't know I wanted that."
2. **Cards are atoms.** Every card must be independently scannable: image, title, key metadata in one glance.
3. **Personalization is the feature.** Surface what the user is likely to want next — recommendation rows are high-value real estate.
4. **Save and resume.** Favorites, watch later, saved searches — users leave and return. Meet them where they left off.
5. **Never lose the user in the grid.** Section headings, pagination, and "see all" links provide orientation.
6. **Fast first render.** Skeletons, lazy images, and fast first card row matter — the grid must feel instant.

---

## Component Specs

### Standard Card
```
Width: flexible (grid cell) — typically 200-320px
Image: aspect-ratio 16:9 (video/media), 1:1 (music/product), 4:3 (travel/place)
Image object-fit: cover
Title: 14-16px, font-weight 500-600, 2-line clamp
Metadata row: 12-13px, text-secondary
Price (if applicable): 14-16px, bold
Favorite button: absolute top-right, 36×36px, heart icon, background: white circle with shadow
Border-radius: 8-12px (travel/marketplace) | 4px (media) | 0 (ultra editorial)
Shadow: default none, hover: 0 4px 16px rgba(0,0,0,0.1)
```

### Category Section Row
```
Heading: 18-22px, font-weight 600, margin-bottom 12px
"See all" link: right-aligned, 14px, brand color
Horizontal scroll: overflow-x: scroll, scroll-snap-type: x mandatory
Scroll snapping: scroll-snap-align: start per card
Scrollbar: hidden (visually), accessible via keyboard
```

### Filter Bottom Sheet (Mobile)
```
Position: fixed bottom 0, full width
Height: auto, max-height 85vh, overflow-y: scroll
Background: white
Border-radius: 16px 16px 0 0
Handle bar: 4px × 32px, centered top, gray
Animation: slide up 250ms ease
Footer: "Apply Filters" (primary) + "Clear All" (ghost), sticky
```

### Skeleton Card
```
Background: var(--surface)
Image area: same aspect ratio as real card, background: linear-gradient shimmer
Title lines: 2 lines, height 14px, border-radius 4px, same shimmer
Animation: @keyframes shimmer, background-position shift 1.5s linear infinite
```

---

## Anti-Patterns to Avoid

- Do not show more than 6 items per horizontal scroll row before a "See all" link.
- Do not hide card metadata (price, rating, duration) until hover — mobile users cannot hover.
- Do not use infinite scroll without an easy way to get back to a specific position.
- Do not auto-play media in card hover on mobile.
- Do not use pagination alone without telling users how many total results exist.
- Do not load the full product catalog without filtering options.
- Do not use pop-up interstitials over the card grid.
- Do not make the save/favorite button so small it's untappable on mobile.

---

## QA Checklist

- [ ] Card grid renders correctly at 375px, 768px, 1024px, 1440px.
- [ ] Skeleton cards shown while data loads.
- [ ] Infinite scroll loads next batch before hitting bottom.
- [ ] Filter updates results without full page reload.
- [ ] Active filter chips visible above results with individual remove buttons.
- [ ] Favorite button has `aria-label` with item name.
- [ ] Rating stars have accessible text alternative.
- [ ] Horizontal scroll rows keyboard navigable (arrow keys or tab).
- [ ] `aria-live` announces new results loaded.
- [ ] Mobile filter bottom sheet accessible and closeable via swipe or close button.
- [ ] All card images have meaningful `alt` text.
- [ ] Dark streaming UI: text-on-image contrast passes 4.5:1.
- [ ] No media autoplays on mobile.
