# Brand Method: Enterprise Trust Hub

Use this skill when building for B2B SaaS, enterprise software, infrastructure, finance, healthcare, industrial, or any context where the buyer is a professional making a high-stakes purchasing decision.

Reference brands: Microsoft, Cisco, Oracle, SAP, IBM, Siemens, Salesforce, GE, Goldman Sachs, JPMorgan Chase, Philips, HSBC, Bank of America.

---

## When to Apply This Method

Apply Enterprise Trust Hub when:
- The buyer is a professional: IT decision-maker, CFO, compliance officer, procurement team.
- The sales cycle is long (weeks to months), involving multiple stakeholders.
- Proof of security, compliance, reliability, and ROI must be on the page.
- The primary CTA is "Contact Sales", "Request Demo", or "Get Pricing".
- The product is B2B software, infrastructure, finance, healthcare systems, or industrial.

Do not apply when:
- The buyer is a consumer (use Product Cinema, Playful Familiarity, or Conversion Simplicity).
- Brand storytelling is the primary goal (use Editorial Brand World).
- The product is simple and direct sign-up (use Conversion Simplicity).

---

## Layout Structure

### Header
- Logo left.
- Mega-navigation: audience/role, product/solution, industry, resources, pricing (if available), login, primary CTA ("Get Demo" or "Contact Sales").
- Mega-nav dropdowns: clean grids of links with icons, grouped by category.
- Sticky on scroll.

### Homepage Structure (in order)
1. **Hero** — clear value proposition (what it does + for whom + key outcome). Primary CTA above fold.
2. **Social proof bar** — 5-8 recognizable customer logos, muted/grayscale.
3. **Product capability overview** — 3-4 card/icon blocks, one capability each.
4. **Solution or audience routing** — "For IT Teams | For Finance | For Operations" segmentation.
5. **Feature deep-dive** — alternating image/text blocks, one feature per section.
6. **Proof section** — metric cards ("40% faster", "99.99% uptime"), case study card(s).
7. **Security / compliance** — badges, certifications, brief copy (SOC2, ISO 27001, HIPAA, GDPR).
8. **CTA section** — "Start Free Trial" or "Talk to Sales", with objection-handling copy.
9. **Resource section** — whitepaper, webinar, or docs teaser.

### Solution / Product Pages
- Clear breadcrumb.
- Hero: product name, value prop, screenshot/diagram, CTA.
- Feature sections: alternating layout, screenshot or diagram + explanation.
- Integration section: compatible tools/platforms logos.
- Pricing teaser (or full pricing page link).
- Case study or customer quote.
- Related products/solutions.
- Footer CTA.

### Navigation
- Mega-navigation with grouped links.
- Role/industry segmentation in nav or above nav.
- Search available in nav.
- Mobile: hamburger → accordion mega-nav.

---

## Color Scheme

### Primary Palette by Sub-category

**Enterprise Tech / SaaS (Microsoft, Salesforce, IBM)**
- Background: `#FFFFFF`
- Primary: `#0078D4` (Microsoft blue), `#00A1E0` (Salesforce), `#1F70C1` (IBM)
- Surface: `#F4F6F9`
- Text: `#323130` or `#1A1A1A`
- Secondary text: `#605E5C`
- CTA: primary color as background, white text
- Hover: darken 10%
- Border: `#EDEBE9`
- Success: `#107C10`
- Warning: `#D83B01`
- Error: `#A4262C`

**Finance / Banking (Goldman Sachs, JPMorgan, HSBC)**
- Background: `#FFFFFF`
- Primary: Navy `#003366` or `#002D72`
- Gold accent: `#C8A96E` or `#B8860B` (sparingly, for premium signals)
- Surface: `#F7F8FA`
- Text: `#1A1A2E`
- CTA: navy background, white text
- Secondary CTA: outlined navy

**Healthcare / Pharma (Philips, 3M)**
- Background: `#FFFFFF`
- Primary: `#0072CE` (calm blue) or `#00A7B5` (teal)
- Surface: `#F0F7FF`
- Text: `#1A2B3C`
- Accent for health: teal, green — calming, clinical trust

**Industrial / Infrastructure (Siemens, GE)**
- Background: `#FFFFFF`
- Primary: `#009999` (Siemens teal) or `#0067B1` (GE blue)
- Surface: `#F5F5F5`
- Text: `#333333`
- Accent: brand teal or blue, never decorative

### Rules
- Conservative palette: blue, white, and neutral grays carry enterprise trust.
- Never use bright orange, yellow, or green as primary CTA in a finance or healthcare context.
- Security section: dark background with trust icons is acceptable and expected.
- Proof metrics: use brand color for the number, neutral for the description.

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| H1 / hero headline | 36-52px | 600-700 | Clear value prop |
| H2 / section title | 26-36px | 600-700 | |
| H3 / feature title | 18-22px | 600 | |
| Body | 15-17px | 400 | 1.6-1.7 line-height |
| Proof metric | 40-60px | 700-800 | Tabular numerals |
| Metric label | 14-16px | 400 | Below the number |
| CTA | 14-16px | 600 | |
| Navigation | 14px | 500 | |
| Badge / certification | 11-12px | 600 | All-caps or bold |

### Font Pairings
| Context | Font |
|---|---|
| Enterprise SaaS | Segoe UI (Microsoft), Salesforce Sans, or Inter |
| Finance | Georgia (editorial), Helvetica Neue, or IBM Plex Sans |
| Healthcare | Source Sans Pro, Open Sans, Roboto |
| Industrial | Roboto, Noto Sans, or system font |

### Rules
- Avoid decorative or display typefaces — clarity and authority over style.
- Body text line-height must be ≥ 1.6 — enterprise docs are information-dense.
- Metric numbers: use `font-variant-numeric: tabular-nums` and a display weight.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Icon gaps |
| `--space-sm` | 8px | Inline elements |
| `--space-md` | 16px | Card padding, form inputs |
| `--space-lg` | 24-32px | Section inner padding |
| `--space-xl` | 48-64px | Between major sections |
| `--space-2xl` | 80-96px | Hero and CTA sections |

- Enterprise pages are information-dense by design — tighter than consumer pages.
- Never so dense that scanning is difficult: group related content, use dividers or cards.
- Card padding: 24-32px. Cards should feel substantial, not cramped.

---

## Motion and Interaction

### Principles
- Animation is minimal and purposeful — this is a professional context, not entertainment.
- Proof metric numbers can count up on scroll: `0 → 40%`, duration 800ms, ease-out.
- Feature illustrations: subtle fade-in on scroll.
- No parallax, no cinematic scrolling, no custom cursors.

### Key Component States
| Component | States |
|---|---|
| Primary CTA | Default, hover (darken 8%), active (darken 12%), focus (ring), loading, disabled |
| Secondary CTA | Default (outlined), hover (fill lightly), focus |
| Accordion / FAQ | Collapsed, expanded (smooth 200ms height transition), focus |
| Mega-nav dropdown | Closed, opening (200ms fade + translate), open, closing |
| Form input | Default, focused (border color), filled, error (red border + message), success |
| Customer logo | Default (grayscale 50%), hover (full color 100%) |

### Form UX
- Label above input always (not inside as placeholder-only).
- Inline validation: only after user leaves the field (blur), not on keystroke.
- Submit: clear loading state, success message, error recovery.
- Required fields: marked with `*` and explained ("* Required").

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Single column. Mega-nav → hamburger + accordion. Proof metrics stack. CTA full-width. Feature sections stack vertically. |
| Tablet 768px | 2-column feature sections. Mega-nav collapses. |
| Desktop 1024px | Full mega-nav. 3-column capability grid. Alternating feature layout. |
| Wide 1440px+ | Content max-width 1200-1440px centered. No full-bleed backgrounds except CTA/footer. |

- Mobile: mega-nav must work as well as desktop — executives use phones.
- Mobile: proof metrics still prominent — enterprise buyers research on mobile.

---

## Accessibility Requirements

- Mega-nav: keyboard-navigable with arrow keys within mega-nav dropdowns. `Escape` closes. Focus returns to trigger.
- Proof metrics: `aria-label="40 percent faster"` — not just "40%".
- Customer logos: `alt="[Company Name] logo"` or `aria-label` if CSS background.
- Form: every input has a `<label>`. Error messages are programmatically associated (`aria-describedby`). Required fields marked with `aria-required="true"`.
- Accordion: `aria-expanded`, `aria-controls`, button as trigger.
- Tables (pricing, comparison): use `<th scope="col/row">`, proper header association.
- Color: never use color alone to communicate status — pair with icon or text.
- PDF downloads: ensure PDFs are tagged and accessible (mention this in handoff).
- Security / certification badge images: `alt` text names the certification.
- All text: minimum 4.5:1 contrast.

---

## UX Principles for This Method

1. **Route by role, not by product.** Enterprise buyers think "I'm a CTO" not "I want product SKU 7."
2. **Proof before promise.** Show the customer logos, the metrics, the case study early. Enterprise buyers are skeptical.
3. **Make complex simple.** Diagrams, progressive disclosure, comparison tables — never walls of feature bullets.
4. **Respect the sales cycle.** Provide self-serve research paths (docs, pricing, case studies) AND demo/contact paths.
5. **Security and compliance are features.** They belong on the product page, not buried in footer.
6. **Trust is earned incrementally.** Layer proof throughout the page: logos → metric → case study → cert → CTA.
7. **Forms are gates, not walls.** Ask for minimum information at each stage. Qualify progressively.

---

## Component Specs

### Proof Metric Card
```
Background: white or very light surface
Border: 1px solid var(--border) or none
Padding: 32px 24px
Metric number: 48-60px, brand primary, font-weight 700
Label: 14-16px, text-secondary, margin-top 8px
Optional icon: 24-32px, muted brand color, above number
Border-radius: 8px
```

### Customer Logo Strip
```
Display: flex, gap 32-48px, align-items: center, flex-wrap: wrap
Logo image: grayscale filter 80-100%, opacity 0.5-0.6
Logo image hover: filter none, opacity 1.0, transition 200ms
Max-height per logo: 32-40px
Heading above: "Trusted by teams at" in muted text-secondary
```

### Mega-Navigation Dropdown
```
Position: absolute, full-width or column-aligned below nav
Background: white
Shadow: 0 8px 24px rgba(0,0,0,0.08)
Padding: 24-32px
Grid: 3-4 columns of grouped links
Link groups: heading (11px, all-caps, text-muted), links (14px, weight 400)
Icon per link: 16-20px, brand color
Open/close: aria-expanded, transition 200ms opacity + translateY
```

### CTA Section
```
Background: brand primary or dark surface
Padding: 64-80px
H2: 28-36px, white/contrasting
Sub-copy: 16-18px, secondary white
CTA button: white background, brand-colored text, or outlined
Secondary CTA: outlined, white border, white text
Spacing between CTAs: 16px
```

---

## Anti-Patterns to Avoid

- Do not bury the CTA below the fold without any CTA in the hero.
- Do not use vague value propositions ("We make business better") — be specific about what, for whom, and the outcome.
- Do not require registration to read case studies or pricing pages.
- Do not show a wall of features without diagrams, screenshots, or social proof.
- Do not use stock photography of people shaking hands or smiling at laptops — use real product screenshots.
- Do not hide pricing — at minimum, acknowledge it exists and offer a pricing page.
- Do not use small fonts for compliance/security copy — it must be readable.
- Do not mix consumer design patterns (countdown timers, emoji-heavy copy) in an enterprise context.
- Do not use `color: red` for all error states — also provide icon and text.

---

## QA Checklist

- [ ] Hero value proposition is clear in 5 seconds without reading body text.
- [ ] Customer logos visible above fold or within first scroll.
- [ ] At least one proof metric with source/context.
- [ ] Mega-nav keyboard navigable (arrow keys, Escape closes).
- [ ] All form inputs have visible labels.
- [ ] Form error messages are programmatically associated with inputs.
- [ ] Security / compliance section present with specific certifications.
- [ ] Mobile: mega-nav works as hamburger accordion.
- [ ] Mobile: CTAs accessible without horizontal scroll.
- [ ] All text meets 4.5:1 contrast.
- [ ] Pricing is findable within 2 clicks or clearly explained.
- [ ] Page loads LCP ≤ 2.5s (enterprise buyers measure performance).
