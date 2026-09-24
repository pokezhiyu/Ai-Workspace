# Industry Reasoning Rules

Load this file when the user provides a product type, business category, or describes what they're building. Use it to instantly match: landing page pattern → UI style → color palette → typography → key effects → anti-patterns.

This is the single-step reasoning engine. Input: product description. Output: complete design system spec in one block.

---

## How to Use

1. Read the user's product description.
2. Find the closest matching industry category below.
3. Output the full **Design System Block** for that category.
4. Layer on top of any brand-specific tokens from `references/design-discovery-protocol.md` if brand assets were provided.
5. Cross-reference with `references/ui-styles-catalog.md` for detailed style token overrides.

---

## Design System Block Format

Every output should follow this structure:

```
┌─────────────────────────────────────────────────────┐
│ TARGET: [Product Name] — RECOMMENDED DESIGN SYSTEM  │
├─────────────────────────────────────────────────────┤
│ PATTERN: [Landing page / layout pattern name]        │
│ Conversion: [Conversion approach]                    │
│ CTA: [CTA placement strategy]                        │
│ Page sections (recommended order):                   │
│   1. [Section]                                       │
│   2. [Section]  ...                                  │
├─────────────────────────────────────────────────────┤
│ STYLE: [Style name from ui-styles-catalog.md]        │
│ Keywords: [3–5 adjectives]                           │
│ Best For: [Industries]                               │
├─────────────────────────────────────────────────────┤
│ COLORS:                                              │
│ Primary:    #[hex] ([name])                          │
│ Secondary:  #[hex] ([name])                          │
│ CTA:        #[hex] ([name])                          │
│ Background: #[hex] ([name])                          │
│ Text:       #[hex] ([name])                          │
│ Notes: [Psychological rationale]                     │
├─────────────────────────────────────────────────────┤
│ TYPOGRAPHY: [Display Font] / [Body Font]             │
│ Mood: [adjectives]                                   │
│ Google Fonts: [import URL or font names]             │
├─────────────────────────────────────────────────────┤
│ KEY EFFECTS:                                         │
│ [Effect 1] + [Effect 2] + [Effect 3]                 │
├─────────────────────────────────────────────────────┤
│ AVOID (Anti-patterns for this category):             │
│ [Anti-pattern 1] + [Anti-pattern 2] + ...            │
├─────────────────────────────────────────────────────┤
│ PRE-DELIVERY CHECKLIST:                              │
│ [ ] No emojis as icons (use SVG: Heroicons/Lucide)   │
│ [ ] cursor-pointer on all clickable elements         │
│ [ ] Hover states: smooth transitions (150–300ms)     │
│ [ ] Text contrast ≥ 4.5:1 on all backgrounds        │
│ [ ] Focus states visible for keyboard nav            │
│ [ ] prefers-reduced-motion respected                 │
│ [ ] Responsive: 375px, 768px, 1024px, 1440px        │
│ [ ] [Category-specific check]                        │
└─────────────────────────────────────────────────────┘
```

---

## Industry Rules

---

### B2B SaaS / Productivity Tools

**Pattern:** Feature-Led Conversion
**Conversion:** Logic + proof. Show the product working, then list features, then price.
**CTA:** Above fold (primary) + end of each feature section (secondary).
**Sections:** Hero → Social proof (logos) → Core feature demo → 3-feature grid → Testimonials → Pricing → Final CTA

**Style:** Minimal Clean or Dark Mode Refined
**Keywords:** Clear, rational, efficient, trustworthy, modern

**Colors:**
- Primary: #4361EE (Indigo-500) — trust + technology
- Secondary: #6B7280 (Neutral-500) — supporting
- CTA: #4361EE or contrasting orange #F97316
- Background: #FAFAFA (Neutral-50)
- Text: #1A1A22 (Neutral-900)
- Notes: Indigo signals capability. Orange CTA creates urgency without alarm.

**Typography:** Inter / Inter (consistent, scannable)
**Mood:** Professional, direct, no-nonsense

**Key Effects:** Subtle hover lifts on feature cards. Screenshot/product UI as hero visual. Clean table for feature comparison.

**Anti-patterns:** Vague hero copy ("The future of work"). Full-bleed video that autoplays. Hiding pricing behind "Contact Sales" for self-serve tiers. Generic stock photos of people at laptops.

**Extra checklist:** [ ] Pricing page exists and is linked from nav. [ ] Free trial CTA is primary, not secondary.

---

### Fintech / Banking / Payments

**Pattern:** Trust-First Conversion
**Conversion:** Security signals first, then features, then conversion.
**CTA:** After trust signals are established — not above fold as the first thing.
**Sections:** Hero (calm, reassuring) → Security/compliance badges → Core features → How it works (3-step) → Testimonials → Pricing or Get started

**Style:** Minimal Clean or Enterprise Trust Hub
**Keywords:** Secure, reliable, transparent, clear, professional

**Colors:**
- Primary: #0072CE (Blue-500) — trust, reliability
- Secondary: #1A7F5A (Green-500) — financial positive
- CTA: #0072CE
- Background: #F5F9FD (cool near-white)
- Text: #1A2B3C (deep blue-black)
- Notes: Never red as primary in fintech — signals loss. Green only for positive states (balance, success).

**Typography:** DM Sans / DM Sans or Source Sans 3 / Source Sans 3
**Mood:** Calm, clear, institutional

**Key Effects:** Animated number counters for stats. Clean data tables. Card components with subtle shadow (not glass).

**Anti-patterns:** Aggressive purple/pink gradients (signals "crypto scam"). Red primary color. Glassmorphism for security-critical UI. Neon or glow effects. Hiding fees.

**Extra checklist:** [ ] All security/compliance claims backed by visible badges or links. [ ] Currency format consistent throughout.

---

### Healthcare / Medical / Wellness

**Pattern:** Trust + Calm Conversion
**Conversion:** Reassurance then outcome. Patient/user anxiety is the primary UX challenge.
**CTA:** Soft, action-positive language ("Book a consultation", not "Sign up now").
**Sections:** Hero (calm, human) → What we treat/offer → How it works → Provider credentials → Patient testimonials → Booking CTA

**Style:** Calm Trust or Soft UI Evolution
**Keywords:** Calm, clean, human, trustworthy, accessible

**Colors:**
- Primary: #0072CE (Healthcare blue) or #1A7F5A (Health green)
- Secondary: #E8F4FD (soft blue tint)
- CTA: Primary color, soft rounded button
- Background: #F5F9FD or white
- Text: #1A2B3C
- Notes: Avoid orange/red for primary — patients associate with emergency. Teal is strong for healthcare innovation.

**Typography:** DM Sans / DM Sans (humanist, approachable)
**Mood:** Calm, approachable, professional

**Key Effects:** Soft card shadows. Human photography (real people, real situations). No animations near medical content — motion can be anxiety-inducing.

**Anti-patterns:** Dark mode as default. Bright saturated colors. Small touch targets (patients may have reduced dexterity). Jargon-heavy copy without plain-language alternative. Red as interactive color.

**Extra checklist:** [ ] All medical claims include appropriate disclaimers. [ ] Emergency contact/hotline visibly accessible. [ ] WCAG AA minimum — prefer WCAG AAA for critical information.

---

### E-commerce / Retail

**Pattern:** Card-Based Discovery or Hero-Centric
**Conversion:** Browse → Discover → Trust → Purchase. Reduce friction at every step.
**CTA:** "Add to cart" must be visually primary on every product card and PDP.
**Sections:** Hero (campaign/offer) → Category navigation → Featured products → Social proof → Trust signals (returns, shipping) → Newsletter

**Style:** Card-Based Discovery or Playful Familiarity (for consumer brands)
**Keywords:** Scannable, desirable, trustworthy, fast

**Colors:**
- Primary: Brand-specific (do not default to blue — retail is brand-driven)
- CTA: High-contrast button, always same color throughout the funnel
- Background: White or near-white — product photography needs clean backing
- Text: Near-black for legibility at small sizes

**Typography:** (Brand-specific). Default: Inter / Inter for mass retail; Playfair Display / Lato for premium.
**Mood:** Product-led, clean, brand-expressive

**Key Effects:** Image hover zoom (subtle, 1.03–1.05× scale). Wishlist heart animation. Cart count badge. Skeleton loading for product grids.

**Anti-patterns:** Background colors that compete with product photography. Auto-playing sound/video. Pop-ups within 3 seconds of landing. Hiding the total price until checkout.

**Extra checklist:** [ ] Price always visible on product card. [ ] "Add to cart" is above the fold on PDP. [ ] Trust badges (returns, secure payment) near CTA on PDP.

---

### SaaS Landing Page / Startup

**Pattern:** Hero-Centric + Social Proof
**Conversion:** Emotion → Proof → Action. Make them feel the outcome before explaining the features.
**CTA:** Hero CTA + one after the features section.
**Sections:** Hero (outcome-led headline) → Logos → Product screenshot/demo → 3 core benefits → How it works → Testimonials → Pricing → Final CTA

**Style:** Gradient Mesh or Aurora Borealis or Minimal Clean
**Keywords:** Modern, energetic, confident, innovative

**Colors:**
- Primary: Indigo or brand-specific
- CTA: High-contrast — orange #F97316 or the brand accent
- Background: Near-white or dark
- Notes: One bold CTA color throughout the entire page. Never change CTA color mid-page.

**Typography:** Plus Jakarta Sans / Inter or Geist / Inter
**Mood:** Ambitious, confident, modern

**Key Effects:** Animated product demo (looping short video or animated mockup). Scroll-triggered section reveals. Number counter animation for key stats (real numbers only).

**Anti-patterns:** Vague hero headline. Multiple CTAs competing in the hero. "Trusted by 10,000+ teams" without a source. Generic stock photos. Gradient on gradient.

**Extra checklist:** [ ] Hero headline states a specific outcome, not a feature. [ ] Single primary CTA in hero. [ ] Real customer logos (not placeholder circles).

---

### Developer Tools / Dev Platforms

**Pattern:** Technical Authority
**Conversion:** Code first — show the DX immediately. Developers evaluate by reading code, not marketing copy.
**CTA:** "Get started" → docs. Not "Sign up for a sales call."
**Sections:** Hero (code snippet or terminal demo) → Key capabilities → Code examples → Integration list → Docs link prominent → Community/GitHub

**Style:** Dark Mode Refined or Data Brutalism or Technical Authority brand method
**Keywords:** Precise, powerful, fast, honest

**Colors:**
- Primary: Dark bg (#0D0D10) with vivid accent (green #3ECF8E or cyan)
- CTA: Accent color — must pop on dark background
- Background: Near-black
- Text: Off-white #EBEBF0

**Typography:** Geist Mono / Geist or JetBrains Mono / Inter
**Mood:** Technical, direct, no marketing fluff

**Key Effects:** Syntax-highlighted code blocks in hero. Terminal animation. Copy-to-clipboard on all code snippets. Version badge / changelog link visible.

**Anti-patterns:** Stock photos of "developers" working. Hiding the actual API/SDK docs behind a sign-up wall. Marketing buzzwords without specifics. Not showing real code in the hero.

**Extra checklist:** [ ] Code examples are real and runnable. [ ] Copy-to-clipboard on all code blocks. [ ] Docs link in primary navigation. [ ] GitHub star count visible.

---

### AI Products / LLM Tools

**Pattern:** Capability Demo + Trust Building
**Conversion:** Show it working → explain what makes it different → reduce risk (free tier/trial).
**CTA:** "Try it free" or "Start building" — always tied to immediate access.
**Sections:** Hero (live demo or animated output) → Key capabilities → Use cases → How it works (technical) → Pricing → FAQ

**Style:** Aurora Borealis or AI-Native UI or Dark Technical
**Keywords:** Intelligent, generative, powerful, reliable

**Colors:**
- Primary: Dark base + emerald/teal or purple accent (avoid the "AI purple/pink" cliché)
- Background: Near-black or very dark navy
- CTA: High-contrast emerald or warm accent on dark

**Typography:** Geist / Geist or Inter / Inter
**Mood:** Capable, modern, trustworthy — not sci-fi gimmicky

**Key Effects:** Streaming text animation (shows AI generating). Input/output interface demo. Animated capability showcase.

**Anti-patterns:** "AI purple/pink gradient" background — massively overused. Claiming "AGI" or intelligence it doesn't have. No explanation of model limitations. Hiding latency or accuracy constraints.

**Extra checklist:** [ ] Hero demonstrates the actual product, not an illustration of AI. [ ] Honest about what the model can and cannot do. [ ] Latency/performance metrics present if speed is a selling point.

---

### Wellness / Beauty / Spa

**Pattern:** Emotion-Led + Social Proof
**Conversion:** Feel the brand first. Then book or buy.
**CTA:** "Book now", "Shop the collection" — always calm, never pushy.
**Sections:** Hero (aspirational lifestyle image) → Services/Products → Brand story → Testimonials/Reviews → Booking or Shop CTA → Location/Contact

**Style:** Soft UI Evolution or Warm Editorial or Organic Biophilic
**Keywords:** Calm, luxurious, natural, caring, premium

**Colors:**
- Primary: Soft pink #E8B4B8, sage green #A8D5BA, or warm terracotta
- CTA: Gold #D4AF37 or deep rose — emotional, warm
- Background: Warm cream #FAF7F2
- Text: Dark warm brown #2A2118
- Notes: Calming palette. Gold for luxury feel.

**Typography:** Cormorant Garamond / Montserrat or Playfair Display / Lato
**Mood:** Elegant, calming, sophisticated

**Key Effects:** Soft shadows. Slow, graceful scroll animations. High-quality photography as hero. Subtle fragrance/texture metaphors in layout.

**Anti-patterns:** Bright neon colors. Harsh animations. Dark mode. Clinical/cold color palettes. "AI purple/pink gradients". Dense information layout.

**Extra checklist:** [ ] Photography is high-quality and on-brand. [ ] Booking flow has minimal steps (≤ 3). [ ] Prices transparent or easily found.

---

### Food & Beverage / Restaurant

**Pattern:** Appetite Appeal + Frictionless Order
**Conversion:** Make the food look incredible. Then make ordering trivially easy.
**CTA:** "Order now", "Reserve a table", "Shop" — immediate and clear.
**Sections:** Hero (food photography) → Menu highlights → Story/About → Location/Hours → Order/Reservation CTA

**Style:** Playful Familiarity or Retro/Neo-Retro or Editorial Typography (for premium)
**Keywords:** Appetizing, warm, inviting, fresh

**Colors:**
- Fast casual: warm reds #D32F2F, yellows #FFC107, oranges — appetite stimulation
- Premium/fine dining: near-black, cream, gold — elegance
- Organic/health: greens #1A7F5A, warm naturals — freshness
- Notes: Red + orange stimulate appetite (documented in food marketing psychology).

**Typography:** Barlow Condensed / Barlow (casual) or Playfair Display / Source Serif (premium)
**Mood:** Warm, inviting, craveable

**Key Effects:** Full-bleed food photography. Slight parallax on hero image. Menu section with clean card layout and clear pricing.

**Anti-patterns:** Autoplay music. Flash-style menu PDFs instead of HTML menu. Not showing prices. Photography that makes food look unappetizing (dark, blurry, stock).

**Extra checklist:** [ ] Menu is HTML (not PDF). [ ] Prices are visible. [ ] Allergen info accessible. [ ] Phone number / address prominent.

---

### Education / EdTech / Online Learning

**Pattern:** Outcome-Led + Trust Building
**Conversion:** What will the student achieve? Show the outcome, then the path.
**CTA:** "Start learning free", "Enroll now" — clear outcome framing.
**Sections:** Hero (student outcome headline) → Course/program highlights → Instructor credibility → Student testimonials → Curriculum overview → Pricing/Enrollment

**Style:** Calm Trust or Minimal Clean
**Keywords:** Clear, encouraging, accessible, credible

**Colors:**
- Primary: Blue #0072CE or Teal #3B9E8E — knowledge, calm
- Secondary: Warm yellow/amber for highlights and achievement
- Background: Light, welcoming — never dark as default for education
- Notes: Avoid aggressive red/orange for primary — associates with stress/urgency, wrong for learning.

**Typography:** Source Sans 3 / Source Serif 4 or DM Sans / DM Sans
**Mood:** Clear, welcoming, credible

**Key Effects:** Progress indicators. Course completion badges/certificates shown. Student work examples (social proof through outcomes).

**Anti-patterns:** Fear-based copy ("Don't get left behind"). Hiding the total cost until checkout. Dark mode as default (reduces readability for long-form content). Video autoplay without captions.

**Extra checklist:** [ ] Captions/transcripts for all video content. [ ] WCAG AA minimum (students may have learning differences). [ ] Clear refund/cancellation policy.

---

### Gaming / Esports / Entertainment

**Pattern:** Experience-First
**Conversion:** Immerse first, convert second. The experience IS the product demo.
**CTA:** "Play now", "Download", "Watch" — action-oriented.
**Sections:** Hero (cinematic, full-bleed) → Gameplay/feature showcase → Social proof (player count, ratings) → Trailer/media → Download/Play CTA

**Style:** Cyberpunk UI or Neon Glow or Dark Mode Refined
**Keywords:** Immersive, exciting, kinetic, bold

**Colors:**
- Primary: Dark (#0D0D10) + neon accent (cyan #00BCD4 or magenta #E040FB)
- CTA: Neon accent on dark — maximum contrast
- Background: Near-black always
- Notes: Color psychology: dark + neon = excitement, focus, exclusivity.

**Typography:** Rajdhani / Barlow or Exo 2 / Inter
**Mood:** Intense, dynamic, premium

**Key Effects:** Particle effects or CSS animations in hero. Scroll-triggered reveals. Sound on hover (optional, always off by default with clear toggle). Full-bleed video/cinematic hero.

**Anti-patterns:** Light/white backgrounds in gaming contexts. Pastel colors. Soft UI. Small type. Excessive loading time on hero animations.

**Extra checklist:** [ ] Video/animation respects prefers-reduced-motion. [ ] Sound is off by default. [ ] Age-rating visible if required.

---

### Luxury / Premium

**Pattern:** Premium Restraint
**Conversion:** Desire through scarcity and exclusivity, not urgency or discount.
**CTA:** "Discover the collection", "Request an appointment" — never aggressive or discounted.
**Sections:** Hero (full-bleed photography, minimal text) → Product/collection → Brand heritage → Craftsmanship detail → Contact/Appointment

**Style:** Premium Restraint brand method or Editorial Typography
**Keywords:** Quiet, confident, exclusive, timeless

**Colors:**
- Primary: Near-black, deep navy, or warm black
- Secondary: Gold #B8960C or platinum #C8C8C8
- Background: Pure white or warm cream — product is the focus
- Text: Deep, rich black/navy
- Notes: Less color = more luxury. One accent maximum.

**Typography:** Didot (or Cormorant Garamond) / Montserrat Light or Optima / Futura
**Mood:** Timeless, exclusive, quiet confidence

**Key Effects:** Extremely slow scroll transitions. Full-bleed photography without text overlay competing. White space as a design element, not an absence.

**Anti-patterns:** Sale badges or discount copy. Multiple CTAs competing. Bright saturated colors. Playful animations. Generic grid layouts. Any pattern that looks "digital-first" rather than "brand-first".

**Extra checklist:** [ ] No discount/sale language visible. [ ] Photography art-directed, not stock. [ ] Single clear contact/purchase path.

---

### Crypto / Web3 / DeFi

**Pattern:** Technical Authority + Trust Building
**Conversion:** Technical credibility first, then opportunity, then conversion.
**CTA:** "Connect wallet", "Launch app", "Read docs" — direct.
**Sections:** Hero (protocol/product overview) → Key metrics (TVL, volume, users — real numbers) → How it works → Security/audit → Community/ecosystem → CTA

**Style:** Dark Technical or Cyberpunk UI
**Keywords:** Decentralized, secure, transparent, powerful

**Colors:**
- Primary: Near-black + vivid accent (teal #3ECF8E, orange #F97316, or brand-specific)
- Background: Dark (#0D0D10)
- CTA: High-contrast accent on dark
- Notes: Avoid "rug pull purple" (deep purple + pink gradient) — associated with scam projects in community perception.

**Typography:** Geist / Geist or Space Grotesk / Inter
**Mood:** Technical, confident, transparent

**Key Effects:** On-chain metrics displayed as live/updating numbers. Code snippets for integration. Network topology or flow diagrams.

**Anti-patterns:** "Rug pull purple" gradient. Invented/unverifiable TVL/volume numbers. Promises of guaranteed returns. Lack of audit report visibility. Anonymous team with no accountability signals.

**Extra checklist:** [ ] Security audit report linked. [ ] Real on-chain metrics (not invented). [ ] Risk disclaimers present.

---

### Corporate / Enterprise B2B

**Pattern:** Enterprise Trust Hub
**Conversion:** Trust + ROI + Risk Reduction. Enterprise buyers need to justify the purchase internally.
**CTA:** "Request a demo", "Talk to sales" — no self-serve in primary CTA for enterprise.
**Sections:** Hero (ROI/outcome-led) → Customer logos (enterprise-recognizable) → Core capabilities → Security/compliance → Case studies with metrics → Pricing/Contact

**Style:** Minimal Clean or Swiss/International or Enterprise Trust Hub brand method
**Keywords:** Trustworthy, scalable, secure, enterprise-ready

**Colors:**
- Primary: Navy #1E3A5F or corporate blue #0072CE
- Secondary: Gray neutral
- CTA: Brand primary or strong contrast
- Background: White or light gray
- Notes: Conservative palette signals stability. Avoid trendy colors that imply startup/risk.

**Typography:** IBM Plex Sans / IBM Plex Sans or Source Sans 3 / Source Serif 4
**Mood:** Professional, credible, no-fluff

**Key Effects:** Data visualization for ROI metrics. Case study cards with named companies (not anonymous). Compliance badge display (SOC 2, ISO 27001, GDPR).

**Anti-patterns:** Consumer-style playful animations. Hiding security/compliance information. Not showing enterprise customer logos. "Try free" as the only CTA (enterprise needs demo).

**Extra checklist:** [ ] Security/compliance page accessible from navigation. [ ] Case studies include company name + specific metric. [ ] Demo booking has < 3 steps.

---

### Portfolio / Personal Brand / Creative

**Pattern:** Work-First Showcase
**Conversion:** The work is the CTA. Contact comes after the work speaks.
**CTA:** "View project", "Contact me", "Download resume" — after a strong portfolio impression.
**Sections:** Hero (name + role + strongest work) → Selected projects → About/Skills → Client logos → Contact

**Style:** Bento Grid or Brutalism or Minimal Clean (depending on creative discipline)
**Keywords:** Original, crafted, personal, confident

**Colors:**
- Personal choice — portfolio is the one context where personality > convention
- Constraint: whatever palette you choose must pass contrast requirements
- Recommendation: one strong accent against a neutral base

**Typography:** Any — but commit. One display face + one body face maximum.
**Mood:** Authentic, distinctive, quality-signaling

**Key Effects:** Project image hover with overlay details. Smooth page transitions. Cursor customization if the style calls for it.

**Anti-patterns:** Lorem ipsum anywhere. Generic "Hire me" CTA with no context. Projects without described outcomes or role. Excessive animations that slow down portfolio browsing.

**Extra checklist:** [ ] Each project describes your specific role. [ ] Contact form or email visible without scrolling to the very bottom. [ ] Projects load fast (optimize images).

---

## Quick Reference: Industry → Style + Palette

| Industry | Primary Style | Primary Color Family | Typography Mood |
|---|---|---|---|
| B2B SaaS | Minimal Clean | Indigo / Blue | Professional sans |
| Fintech | Minimal Clean | Blue | Humanist sans |
| Healthcare | Calm Trust | Blue / Teal | Humanist sans |
| E-commerce | Card-Based | Brand-specific | Depends on brand |
| SaaS Landing | Gradient Mesh | Indigo + Orange CTA | Modern sans |
| Dev Tools | Dark Technical | Dark + Green/Cyan | Mono + sans |
| AI Products | Aurora / Dark | Dark + Teal/Emerald | Geometric sans |
| Wellness/Beauty | Soft UI Evolution | Blush / Sage / Gold | Elegant serif |
| Food/Beverage | Playful / Retro | Red-Orange / Warm Green | Condensed / Serif |
| EdTech | Calm Trust | Blue / Amber highlights | Clear humanist |
| Gaming | Cyberpunk / Dark | Dark + Neon | Condensed bold |
| Luxury | Premium Restraint | Near-black / Gold | Display serif |
| Crypto/Web3 | Dark Technical | Dark + Vivid accent | Geometric sans |
| Enterprise | Enterprise Trust Hub | Navy / Corporate Blue | Corporate sans |
| Portfolio | Bento / Brutalism | Personal choice | Personal choice |
