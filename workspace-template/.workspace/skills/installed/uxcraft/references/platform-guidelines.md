# Platform Guidelines for UI/UX Agents

Use platform-specific conventions instead of applying one generic web pattern everywhere.

## Authoritative Sources to Check

- Apple Human Interface Guidelines for iOS, iPadOS, macOS, watchOS, visionOS.
- Material Design 3 for Android and Material web patterns.
- Microsoft Windows app design and Fluent design guidance.
- WAI-ARIA Authoring Practices Guide for complex web widgets.
- W3C Mobile Accessibility for mobile web and hybrid apps.

## Web App

- Use semantic HTML before ARIA.
- Support keyboard, screen readers, responsive layout, browser zoom, and reduced motion.
- Handle 320px width, common mobile widths, tablet, desktop, and wide layouts.
- Avoid hover-only interactions and hidden critical actions.
- Provide URL-addressable states when useful.

## iOS / Apple Platforms

- Respect safe areas, native navigation patterns, sheets, tab bars, and gestures.
- Use platform-expected controls when building native or native-like UI.
- Prefer clarity, deference, and depth.
- Avoid replicating Android/desktop navigation models directly.
- Consider Dynamic Type, VoiceOver, Reduce Motion, and system appearance.

## Android / Material

- Follow Material navigation patterns: navigation bar, rail, drawer, top app bar as appropriate.
- Use meaningful elevation, shape, state layers, motion, and adaptive layouts.
- Support back behavior, touch targets, TalkBack, and system font scaling.

## Windows / Desktop

- Support keyboard accelerators, focus rectangles, resize behavior, menus, context menus, and high contrast.
- Use desktop density and multi-window expectations where appropriate.
- Respect platform conventions for dialogs, settings, notifications, and file pickers.

## Kiosk / Touchscreen

- Large targets, simple choices, clear recovery, timeout handling, privacy at public screens.
- Avoid long text input. Provide visible help and cancellation.

## Email UI

- Assume constrained CSS and inconsistent clients.
- Use table-compatible layouts if implementation requires broad email support.
- Keep CTA visible, copy concise, alt text useful, and dark-mode behavior safe.

## TV / Remote

- Focus management is primary. Every action must work with directional controls.
- Large type, strong contrast, clear focus state, minimal text input.

## Cross-Platform Rule

When adapting a product across platforms, keep the mental model, information architecture, and content consistent, but adapt navigation, controls, gestures, density, and system affordances to the platform.
