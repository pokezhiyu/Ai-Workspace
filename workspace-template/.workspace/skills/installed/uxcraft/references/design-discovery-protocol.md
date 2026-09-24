# Design Discovery Protocol

Load this file at the start of every fresh design task. The protocol has two phases: **intake** (question form) and **brand extraction**. Complete both before writing any CSS, tokens, or visual specs.

The single biggest cause of wasted design cycles is starting visuals before locking down surface, audience, tone, and brand context. This protocol eliminates that problem.

---

## Phase 1 — Discovery Question Form

**Rule: Turn 1 of any new design task is this form only.** Do not produce wireframes, code, tokens, or visual descriptions in the same turn as the form. Show the form. Wait. Let the user answer. Then proceed.

If the user provides a very detailed brief, the form may be shortened to only the unanswered dimensions — but never skipped entirely. A detailed brief still leaves visual tone, scale, and constraints open.

### Form Template

Present this as a structured set of questions. Group them clearly. Give the user sensible defaults they can accept quickly.

```
Before I start designing, I need to lock down a few things (takes ~60 seconds):

1. SURFACE
   What are we designing?
   [ ] Web page / landing page
   [ ] Web app / SaaS dashboard
   [ ] Mobile app (iOS / Android)
   [ ] Email / newsletter
   [ ] Slide deck / presentation
   [ ] Component / design system piece
   [ ] Other: ___

2. AUDIENCE
   Who is the primary user?
   [ ] General consumer (any age, any tech level)
   [ ] Professional / knowledge worker
   [ ] Developer / technical user
   [ ] Enterprise buyer / decision-maker
   [ ] Children / family
   [ ] Other: ___

3. TONE
   What should it feel like?
   [ ] Premium / luxury — quiet, restrained, confident
   [ ] Energetic / bold — high-contrast, expressive, dynamic
   [ ] Calm / trustworthy — soft, clear, clinical
   [ ] Playful / friendly — rounded, warm, approachable
   [ ] Technical / precise — data-dense, monospace, diagram-forward
   [ ] Minimal / editorial — lots of whitespace, typographic
   [ ] Other: ___

4. BRAND CONTEXT
   Do you have brand assets?
   [ ] Yes — I'll share a URL, screenshot, or hex codes
   [ ] Partial — I have a logo but no full system
   [ ] No brand yet — suggest directions
   [ ] Existing codebase — inspect it first

5. SCALE AND FIDELITY
   What do you need as output?
   [ ] Quick concept / wireframe (fast, grey-block placeholder OK)
   [ ] Mid-fidelity mockup (layout + real colors, placeholder content OK)
   [ ] High-fidelity spec (production-ready, real copy, all states)
   [ ] Full design system (tokens, components, usage rules)

6. CONSTRAINTS
   Any hard requirements?
   (Examples: accessibility WCAG AA, RTL support, dark mode required,
    specific tech stack, existing component library, performance budget)
   Free text: ___
```

### Form Rules

- Do not interpret or guess any dimension the user has not answered.
- If the user answers "Other" on any dimension, ask one follow-up question before proceeding.
- If the user accepts all defaults, treat unchecked items as: Web page, General consumer, Minimal/editorial, No brand, Mid-fidelity, No constraints.
- Once all six dimensions are answered, confirm back in one sentence: "Got it — [surface] for [audience], [tone] feel, [brand status], [fidelity] output. Starting now."
- Then proceed to Phase 2 or directly to design if brand is already known.

---

## Phase 2 — Brand Extraction Protocol

Run this phase when the user provides a brand URL, screenshot, or partial assets. Do **not** guess brand colors from memory. Do not assume a brand's palette from the company name alone.

### 5-Step Extraction

**Step 1 — Locate assets.**
- If URL given: navigate to the homepage or provided page.
- If screenshot given: examine it directly.
- If logo file given: examine the file.
- Note: primary hero color, CTA button color, background color, heading font, body font, any distinctive icon or illustration style.

**Step 2 — Extract hex values precisely.**
- For URLs: look for CSS variables (`--color-primary`, `--brand`, etc.), inline styles, or Tailwind config.
- For screenshots: identify the dominant colors, CTA button, and background. Use exact observed values — never approximate.
- For logos: extract the exact brand color(s) from the SVG or image.
- Never hallucinate hex values. If you cannot extract precisely, state: "I could not extract exact values — I'll use the closest approximation and mark it for user verification."

**Step 3 — Identify typography.**
- Font family used for headings and body.
- Approximate weight (light/regular/medium/bold).
- Approximate size ratio between heading and body.
- If not determinable from assets, note: "Font not identified — will use a matching system font."

**Step 4 — Write a brand-spec summary.**

After extraction, produce this brief before any visual work:

```
BRAND SPEC: [Brand Name]
Primary color: #[hex] — [description, e.g. "deep navy, used for nav and CTA"]
Secondary color: #[hex] — [description]
Accent / CTA: #[hex] — [description]
Background: #[hex]
Text: #[hex]
Heading font: [name or "not identified"]
Body font: [name or "not identified"]
Tone cues: [2-3 adjectives from brand observation, e.g. "minimal, technical, dark-surface"]
Anti-patterns observed: [anything the brand explicitly avoids — e.g. "no drop shadows", "no rounded corners"]
Confidence: [HIGH / MEDIUM / LOW — based on quality of source assets]
```

**Step 5 — Vocalise before designing.**
State the brand spec out loud in one sentence before starting:
> "I'm designing in [Brand Name]'s system: [primary color] primary, [font] type, [tone] feel. Proceeding."

This confirms to the user that extraction was correct before any visual work begins.

### When Brand Assets Are Absent

If the user selects "No brand yet" in the question form, do not improvise. Instead:

1. State: "No brand provided. I'll offer 5 visual directions — pick one or describe your preference."
2. Load `references/visual-directions.md` and present the 5 direction summaries.
3. Wait for the user to select or describe a preference.
4. Bind the selected direction's tokens as the design baseline.
5. Note in the output: "Visual direction: [name]. All tokens are provisional — update when brand is confirmed."

---

## Phase 3 — Junior Designer Warm-Up (for high-fidelity requests)

When the user requests high-fidelity or full-spec output, add one lightweight step between the question form and the final design:

1. **Show a wireframe sketch first.** Grey blocks for images, placeholder text ("Headline here", "Body copy"), real layout structure, no color, no typography polish.
2. **Confirm direction** in one line: "This is the layout I'm planning — does this structure work before I apply brand and polish?"
3. Wait for confirmation or redirect.
4. Only then produce the final design.

This step costs one extra turn but eliminates the risk of fully polishing a layout the user doesn't want.

**Skip the warm-up when:**
- The user explicitly says "skip wireframe" or "go straight to final."
- The task is a minor edit or component update (not a full page/screen).
- The user has provided a reference screenshot or detailed layout description.

---

## Discovery Checklist

Before proceeding to any visual output, confirm:

- [ ] Surface identified (web / app / mobile / email / deck / component).
- [ ] Audience identified (consumer / professional / developer / enterprise / children).
- [ ] Tone identified (premium / energetic / calm / playful / technical / minimal).
- [ ] Brand status known (full assets / partial / none / inspect codebase).
- [ ] Fidelity level agreed (concept / mid / high / design-system).
- [ ] Constraints noted (a11y, RTL, dark mode, tech stack, performance).
- [ ] Brand spec written (if assets provided) OR visual direction selected (if no brand).
- [ ] Warm-up wireframe shown (for high-fidelity requests only).
