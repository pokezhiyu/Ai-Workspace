# UI/UX Project Memory Workflow

Use this workflow every time `ui-ux-master` is used on a project. Its purpose is to keep the UI consistent across the whole application instead of generating a different visual style each time.

## Core Principle

The agent must behave like an adaptive product designer who respects the product's existing identity.

- If an existing product/app has branding, preserve it.
- If a design system exists, extend it instead of replacing it.
- If a UI/UX memory file exists, read it before making design decisions.
- If no memory file exists, create one after inspecting the project or asking key questions.
- Only introduce a new visual direction when the user explicitly asks for redesign, rebrand, new theme, or specific modification.

## Memory File Location

When working inside a project, use this priority order:

1. Project-specific memory file already present:
   - `.ui-ux-memory.md`
   - `docs/ui-ux-memory.md`
   - `docs/design/ui-ux-memory.md`
   - `design/ui-ux-memory.md`
2. If none exists, create:
   - `.ui-ux-memory.md` at the project root.
3. If project root is unclear, ask for the project root or create the memory file beside the main frontend app after explaining the assumption.

Do not create the memory file inside the `ui-ux-master` skill folder for each app. The memory belongs to the application being designed.

## Required First Step Every Time

Before creating or modifying frontend, inspect for existing design memory and branding:

- Read `.ui-ux-memory.md` or equivalent if it exists.
- Search for design tokens, theme files, CSS variables, Tailwind config, Sass variables, component library config, Figma exports, Storybook, or DESIGN.md.
- Inspect existing global CSS and representative components/screens.
- Identify current colors, fonts, spacing, radius, shadows, layout patterns, button styles, form styles, icon style, and tone of voice.
- Check package/dependencies before assuming any UI library.

## Existing Product Behavior

If the project already has UI/branding:

1. Extract the existing design facts.
2. Update/create `.ui-ux-memory.md` with those facts.
3. Follow the existing branding as the default.
4. Add new screens/components using the same tokens, components, and interaction patterns.
5. If something is inconsistent, propose a normalization plan instead of inventing a new look.
6. If the user asks for a specific visual change, update only the requested dimension and preserve everything else.

## Fresh Product Behavior

If the project is new and no branding exists, ask only the minimum high-value questions needed:

1. What are you building and who is it for?
2. What is the primary user action or success moment?
3. What personality should it have: premium, playful, enterprise, technical, calm, bold, luxury, friendly, etc.?
4. Any colors, fonts, logos, competitors, or references you want to use or avoid?
5. Is this web, mobile, dashboard, landing page, ecommerce, SaaS, admin, or another type?

If the user does not answer, proceed with clearly labeled assumptions and create `.ui-ux-memory.md` from those assumptions.

## What to Store in UI/UX Memory

Store stable design decisions, not temporary task notes.

Required sections:

- Product summary.
- Target users and primary jobs-to-be-done.
- Brand personality.
- Design method blend.
- Color tokens.
- Typography.
- Spacing/layout rhythm.
- Radius/elevation/shadows.
- Component rules.
- Interaction/state rules.
- Accessibility rules.
- Content/microcopy voice.
- Responsive rules.
- Do/don't rules.
- Change log for design-system decisions.

Do not store:

- One-off bug status.
- Temporary implementation progress.
- Commit hashes or PR numbers.
- Personal secrets.
- Credentials.
- Raw analytics exports.
- Anything that will be stale in a few days unless it is clearly marked as temporary and removed later.

## How to Use Memory During Implementation

Before editing:

- Read the memory file.
- State the existing style baseline in your working notes or summary.
- Identify whether the user asked to preserve, extend, or change the style.

During design:

- Reuse stored tokens and component rules.
- Prefer extending existing patterns over creating new variants.
- If a new component is needed, define it in memory so future work uses the same pattern.
- If a new color/font/spacing/radius is needed, justify it and add it as a token.

After implementation:

- Update the memory file if stable UI rules changed.
- Add only durable decisions.
- Keep the memory concise and structured.
- Mention in the final response whether memory was read/created/updated.

## Adaptive Decision Rules

The skill should be intelligent, not robotic:

- If existing branding is strong, prioritize consistency over trendiness.
- If existing branding is weak or inconsistent, normalize it into a clearer token system.
- If the user asks for "modernize" or "make it better", improve hierarchy, spacing, states, accessibility, and consistency first before changing colors.
- If the user asks for a new style, confirm whether it is a full redesign or a local change.
- If different parts of the app conflict, choose the pattern used by the most complete/recent/high-quality screen and document the decision.
- If the UI library limits design choices, adapt the desired style to the library instead of fighting it.
- If brand details are missing, infer from product category and ask only if the choice would materially change the result.

## Existing Branding Inspection Checklist

Look for:

- Logo and wordmark usage.
- Primary/secondary/accent colors.
- Background and surface colors.
- Text color hierarchy.
- Fonts and font loading.
- Type scale and weights.
- Spacing scale.
- Grid/container widths.
- Border radius.
- Shadows/elevation.
- Button variants.
- Form/input styling.
- Cards and panels.
- Navigation style.
- Modal/drawer/popover style.
- Table/list style.
- Empty/error/loading states.
- Icons/illustrations/images.
- Animation/motion style.
- Voice/tone in headings, CTAs, errors.

## Conflict Resolution

When a requested change conflicts with memory:

1. Follow explicit user instruction.
2. Preserve unaffected design rules.
3. Update memory with the new rule if the change is durable.
4. Note the change in the memory change log.

When user intent is ambiguous:

- Ask whether they want a local change or global design-system change.
- If low-risk, make a local change and document it as local.

## Required Final Response Note

When finishing UI work, include a short note:

- UI/UX memory: read / created / updated / not available.
- Branding baseline followed.
- Any new durable design decisions added.
- Any intentional deviations from existing style.
