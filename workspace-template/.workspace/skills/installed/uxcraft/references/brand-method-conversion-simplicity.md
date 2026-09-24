# Brand Method: Conversion Simplicity

Use this skill when building for subscription products, fintech signups, mobile app downloads, SaaS trials, waitlists, or any context where the entire page exists to convert one type of visitor to one action.

Reference brands: Netflix, PayPal, Uber, Google (signup), Instagram (signup), LinkedIn (signup), Dropbox, Stripe, Linear.

---

## When to Apply This Method

Apply Conversion Simplicity when:
- There is one primary user action: sign up, start trial, download, subscribe, join waitlist.
- The user is a new visitor evaluating whether to commit.
- Reducing friction is more valuable than providing exhaustive information.
- The funnel is: land → understand → trust → act.

Do not apply when:
- Users need to browse or discover first (use Card-Based Discovery).
- Multiple stakeholders are evaluating a complex product (use Enterprise Trust Hub).
- The product experience is the selling point (use Product Cinema or Editorial Brand World).

---

## Layout Structure

### Above the Fold (the only thing that matters)
- **One promise**: the most compelling, specific outcome the user gets. Not a feature list.
- **One primary CTA**: email signup, "Start Free Trial", "Get the App", "Join Waitlist". Nothing else.
- **Visual proof**: product screenshot, phone mockup, short testimonial, or simple illustration.
- **Objection handler**: one line of trust copy beneath the CTA ("No credit card required", "Free forever plan", "Cancel anytime").

### Page Flow (in order)
1. **Hero** — promise + CTA + objection handler.
2. **Social proof** — trusted by N users/companies, logo strip, star rating aggregate.
3. **Core benefit blocks** — 3 benefits max. Each: icon, one-line headline, one supporting sentence.
4. **Product proof** — screenshot, animation, or short demo video showing the product working.
5. **Testimonials** — 3 specific quotes with name, title, company, photo.
6. **FAQ** — 5-7 questions answering the top objections (pricing, commitment, compatibility).
7. **Final CTA** — repeat the hero CTA with the same promise, no new information.

### Navigation
- Minimal: logo left, 2-3 links max (Features, Pricing, Login), primary CTA right.
- Do not provide a full mega-nav — it gives users escape routes.
- No sticky nav unless it includes the CTA.

### Footer
- Minimal. Legal links, privacy, terms, social icons. No sitemap.

---

## Color Scheme

### Primary Palette Patterns

**SaaS / Startup (Stripe, Linear, Vercel)**
- Background: `#FFFFFF` or dark `#0A0A0A` / `#111111`
- Primary: brand color (`#635BFF` Stripe purple, `#5E6AD2` Linear, `#000000` Vercel)
- Surface: `#F4F4F5` (light) or `#1C1C1E` (dark)
- Text: `#0F0F0F` (light) or `#FAFAFA` (dark)
- Secondary text: `#71717A`
- CTA: brand primary, white text — maximum contrast
- CTA hover: darken 10%
- Accent: gradient (`#635BFF → #0074D9`) for premium SaaS feel

**Fintech / Payments (PayPal, Stripe)**
- Background: `#FFFFFF`
- Primary: `#0070BA` (PayPal blue) or `#635BFF`
- Trust accent: `#00457C` (darker blue, for security copy)
- CTA: primary blue, white text
- Success: `#007B5E`

**Consumer App (Netflix, Uber, Instagram)**
- Netflix: Background `#000000`, accent `#E50914` (red), text white
- Uber: Background `#000000` or `#FFFFFF`, monochrome, CTA black-on-white or white-on-black
- Instagram: gradient CTA on white background, or gradient hero

**Minimal / Developer (Vercel, GitHub, Linear)**
- Background: `#000000` or `#FAFAFA`
- Text: inverse of background
- Accent: 1 brand color or white
- No gradients unless minimal and purposeful

### Rules
- CTA button must be the highest-contrast interactive element on the page.
- Social proof logos: grayscale — they support, not compete.
- Testimonial sections: slightly different background (`#F9FAFB`) to create visual rhythm.
- Never use two competing CTAs in the hero (no "Sign Up" + "Learn More" — pick one).

---

## Typography

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero headline | 40-72px | 700-900 | Bold, specific promise |
| Hero subheadline | 18-22px | 400 | Supporting detail, max 2 lines |
| Section headline | 28-36px | 600-700 | |
| Benefit headline | 18-20px | 600 | |
| Benefit body | 15-16px | 400 | 1 sentence |
| Testimonial quote | 18-22px | 400-500 | Italic optional |
| Testimonial attribution | 14px | 500 | Name, title, company |
| FAQ question | 16-18px | 600 | |
| FAQ answer | 15-16px | 400 | |
| CTA | 15-18px | 600 | |
| Trust copy (under CTA) | 12-14px | 400 | Muted color |

### Font Pairings
| Context | Font |
|---|---|
| SaaS / startup | Inter, Plus Jakarta Sans, or Geist |
| Fintech | Helvetica Neue, DM Sans, or Lato |
| Consumer app | Circular, Nunito, or Poppins |
| Developer tool | Geist, JetBrains Mono (for code), Inter |

### Rules
- Hero headline: the most important thing on the page. It must be large and specific.
- Avoid vague headlines ("The future of work") — use outcomes ("Ship 3× faster with automated deploys").
- Trust copy under CTA: 12-14px, muted color — supportive, not competing.

---

## Spacing System

| Token | Value | Use |
|---|---|---|
| `--space-xs` | 4px | Trust copy gap from CTA |
| `--space-sm` | 8px | Icon to text, badge padding |
| `--space-md` | 16-20px | Component padding |
| `--space-lg` | 32-40px | Between sections within same topic |
| `--space-xl` | 64-80px | Between major page sections |
| `--space-2xl` | 96-128px | Hero padding, final CTA section |

- Hero: generous padding top and bottom (80-128px) — breathing room signals confidence.
- Benefit blocks: equal spacing, grid alignment — visual consistency conveys professionalism.
- FAQ: no extra spacing — tight, scannable, no wasted room.

---

## Motion and Interaction

### Hero CTA
- Button: no over-engineered animation. Hover: darken 8-10%, scale `1.02`, transition 150ms.
- On submit: show loading spinner inside button, disable button, replace text with "…".
- On success: replace CTA area with success message ("Check your email!" or redirect).
- On error: show inline error below CTA, shake animation on button (3-frame, 200ms).

### Product Preview
- Short looping video (10-15s, muted, no controls) OR animated GIF OR screenshot with subtle entrance animation.
- `prefers-reduced-motion`: replace with static screenshot.
- Load above fold immediately — this is conversion-critical content.

### FAQ Accordion
- Height transition: `max-height` 0 → auto equivalent, 200ms ease.
- Icon rotates 90° or 45° when open.
- Only one open at a time (optional — single-expand pattern).

### Scroll Animations
- Keep minimal: fade-in of benefit blocks, testimonials. Duration 300-500ms.
- Never use scroll animations on the CTA — users may be scrolling to reach it.

---

## Responsive Behavior

| Breakpoint | Key changes |
|---|---|
| Mobile 375px | Hero: headline 28-36px. CTA: full-width button. Benefit blocks: single column. Testimonials: horizontal scroll or single-column. Nav: logo + CTA only (no extra links). |
| Tablet 768px | Hero: headline 36-48px. 2-column benefits. |
| Desktop 1024px | Full layout. Side-by-side hero text + product image/video. |
| Wide 1440px+ | Max-width 1100-1200px centered. Hero may use split layout at 1440px+. |

- Mobile CTA: full-width button, at least 48px height, pinned to viewport if possible.
- Mobile: no horizontal scroll except testimonials carousel.

---

## Accessibility Requirements

- CTA button: descriptive label — not just "Sign Up" but "Start your free trial" or match the specific offer.
- Email input: always a `<label>`. `type="email"`, `autocomplete="email"`, `inputmode="email"`.
- Trust copy under CTA: `role="note"` or just visible text — no hidden aria required.
- Product video: `<video>` with `aria-label`, `loop`, `muted`, no `autoplay` without `playsinline`; poster image required; `prefers-reduced-motion` disables autoplay.
- Testimonial images: `alt="[Person Name], [Title] at [Company]"`.
- FAQ accordion: `<button aria-expanded="true/false" aria-controls="faq-answer-id">`. Answer `<div id="faq-answer-id">`.
- Social proof logos: `alt="[Company Name]"`.
- All text: 4.5:1 contrast minimum. CTA text on brand button must pass.
- Focus: CTA is the first logical focus target after the hero heading.

---

## UX Principles for This Method

1. **One job, one CTA.** Every element on the page exists to support the single conversion event.
2. **Answer objections before they form.** "No credit card" under the CTA is worth more than a features section.
3. **Specificity converts.** "Save 5 hours/week on reporting" beats "Save time." Name the number, name the outcome.
4. **Social proof is not decoration.** Real names, real companies, specific outcomes in quotes.
5. **Remove escape routes.** Minimal nav means fewer ways to leave the page without converting.
6. **Repeat the CTA.** Users need to see it multiple times before committing — top, middle, and bottom of page.
7. **Speed is a conversion feature.** A 1-second delay reduces conversions. Image optimization, no-blocking scripts, instant form feedback.

---

## Component Specs

### Hero CTA Button
```
Background: brand primary (max contrast)
Text: white or high-contrast inverse
Padding: 14-16px 32-40px
Border-radius: 6px (modern) | 24px (friendly) | 2px (serious/fintech)
Font: 16-18px, weight 600
Min-height: 48-52px
Width: auto (desktop) | 100% (mobile)
Transition: background 150ms, transform 120ms
```

### Trust Copy (under CTA)
```
Font: 12-13px
Color: var(--text-muted)
Margin-top: 10-12px
Icon: optional checkmark or lock icon (14px)
Example: "✓ No credit card required  ·  ✓ Cancel anytime"
```

### Testimonial Card
```
Background: white (on light) or var(--surface) (on dark)
Border: 1px solid var(--border)
Border-radius: 12px
Padding: 24-28px
Quote: 17-20px, weight 400, font-style italic optional
Attribution: 14px, weight 500, flex row with avatar
Avatar: 36-40px, border-radius 50%
```

### FAQ Item
```
Border-bottom: 1px solid var(--border)
Trigger button: full width, text-left, 17-18px, weight 600, padding 16px 0
Chevron icon: right-aligned, 16px, rotates 180° on open, transition 200ms
Answer: 15-16px, text-secondary, padding 0 0 16px, line-height 1.6
```

---

## Anti-Patterns to Avoid

- Do not add a full navigation with 8+ links — it gives users too many ways to leave.
- Do not use vague CTAs like "Learn More" as the primary action — users need to know what happens next.
- Do not put pricing objections in a way that makes pricing seem scary — be honest and frame value first.
- Do not require more than an email (and optionally a name) for the first signup step.
- Do not use dark patterns: pre-checked marketing consent, hidden trial-to-paid, confusing cancellation.
- Do not show 10 testimonials — 3 specific, credible testimonials outperform 10 generic ones.
- Do not use countdown timers unless the offer genuinely expires.
- Do not make the page long before you've earned the scroll — the best Conversion Simplicity pages are short.

---

## QA Checklist

- [ ] Hero headline is specific and outcome-focused — not generic.
- [ ] CTA is the visually dominant interactive element.
- [ ] Trust copy (no credit card / cancel anytime) visible below CTA.
- [ ] Email input has `<label>` and correct input type.
- [ ] CTA button has descriptive accessible label.
- [ ] Form error message shown inline, associated with input via `aria-describedby`.
- [ ] Product video: muted, poster, `prefers-reduced-motion` fallback.
- [ ] Social proof logos grayscale.
- [ ] FAQ accordion has `aria-expanded` and `aria-controls`.
- [ ] Final CTA section repeats the hero CTA.
- [ ] Mobile: CTA full-width, at least 48px height.
- [ ] No more than 3 links in nav.
- [ ] Page LCP ≤ 2.5s — hero content must be server-rendered or critically preloaded.
- [ ] No dark patterns: no pre-checked marketing consent, no hidden costs, no fake urgency.
