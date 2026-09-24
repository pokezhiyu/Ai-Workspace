# Tech Stack Guidelines

Load this file when the user specifies a frontend framework or tech stack. Apply the stack-specific rules on top of the design system tokens and component specs. Each section covers: component patterns, styling approach, accessibility patterns, and common pitfalls to avoid.

Default stack when none specified: **HTML + Tailwind CSS**.

---

## Stack Index

| # | Stack | Trigger words |
|---|-------|--------------|
| 1 | HTML + Tailwind CSS | "tailwind", "html", "vanilla", no stack specified |
| 2 | React + Tailwind | "react", "vite + react", "create react app" |
| 3 | Next.js | "next", "next.js", "nextjs", "app router", "pages router" |
| 4 | Vue 3 | "vue", "vue 3", "composition api" |
| 5 | Nuxt.js | "nuxt", "nuxt.js", "nuxt 3" |
| 6 | Angular | "angular", "ng" |
| 7 | Svelte / SvelteKit | "svelte", "sveltekit" |
| 8 | Astro | "astro" |
| 9 | Remix | "remix" |
| 10 | SolidJS | "solid", "solidjs" |
| 11 | React Native | "react native", "rn", "expo mobile" |
| 12 | Flutter | "flutter", "dart" |
| 13 | SwiftUI | "swiftui", "ios", "swift" |
| 14 | shadcn/ui | "shadcn", "shadcn/ui", "radix" |
| 15 | Jetpack Compose | "jetpack", "compose", "android" |
| 16 | Laravel (Blade + Tailwind) | "laravel", "blade", "php" |

---

## 1 — HTML + Tailwind CSS

**Use for:** Static sites, landing pages, simple web apps, when user doesn't specify a framework.

### Component Pattern
```html
<!-- Button — Primary -->
<button
  class="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
         text-white font-medium px-5 py-2.5 rounded-lg
         transition-colors duration-150
         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed"
  type="button">
  Get Started
</button>

<!-- Card -->
<div class="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 class="text-lg font-semibold text-neutral-900">Card Title</h3>
  <p class="mt-2 text-sm text-neutral-600">Card description text here.</p>
</div>

<!-- Input with label -->
<div class="space-y-1.5">
  <label for="email" class="block text-sm font-medium text-neutral-700">Email</label>
  <input
    id="email" type="email" name="email"
    class="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300
           text-sm text-neutral-900 placeholder:text-neutral-400
           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
           disabled:bg-neutral-100 disabled:text-neutral-400"
    placeholder="you@example.com" />
</div>
```

### Rules
- Always use semantic HTML: `<button>` not `<div onclick>`. `<nav>`, `<main>`, `<section>`, `<article>` for structure.
- Never use Tailwind arbitrary value interpolation: `bg-[${color}]` is a runtime error — use full class names.
- CSS variables for brand tokens: define in `:root`, reference in Tailwind config via `extend.colors`.
- `prefers-reduced-motion`: wrap all transitions in `motion-safe:` variant or check via JS.
- Dark mode: use `dark:` prefix classes. Enable in `tailwind.config.js` with `darkMode: 'class'`.

### Common AI Mistakes to Avoid
- `text-shadow-*` — Tailwind has no text-shadow utility by default (needs plugin).
- `h-screen` on mobile — causes layout shift with dynamic viewport height. Use `min-h-dvh` instead.
- `target="_blank"` without `rel="noopener noreferrer"` — security vulnerability.
- `hover:` states without matching `focus-visible:` states — breaks keyboard navigation.
- Interpolated class names: `bg-${color}-500` — Tailwind purges these and they won't work.

---

## 2 — React + Tailwind CSS

**Use for:** SPAs, interactive dashboards, component-heavy applications.

### Component Pattern
```tsx
// Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
}

const Button = ({ variant = 'primary', size = 'md', disabled, onClick, children, 'aria-label': ariaLabel }: ButtonProps) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400',
    secondary: 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 focus:ring-neutral-400',
    ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button">
      {children}
    </button>
  );
};
```

### Rules
- Use `clsx` or `cn()` (from shadcn) for conditional class merging — not template literals.
- All form inputs must have associated `<label>` (via `htmlFor`) or `aria-label`.
- Client state with `useState`/`useReducer`. Never fetch in render — use `useEffect` or React Query.
- List items always need `key` prop with stable IDs — not array index for dynamic lists.
- Accessible modals: use `role="dialog"`, `aria-modal="true"`, trap focus, close on Escape.

### Common AI Mistakes
- Missing `key` prop on list items (causes React reconciliation bugs).
- `useEffect` with missing dependencies (stale closures).
- Mutating state directly: `state.items.push(x)` — always return new objects/arrays.
- `onClick` on non-interactive elements without `role` and `tabIndex`.
- Not handling loading and error states in async components.

---

## 3 — Next.js (App Router)

**Use for:** Production web apps, SEO-important pages, full-stack React applications.

### Component Pattern
```tsx
// app/components/ui/card.tsx — Server Component (default)
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('bg-white border border-neutral-200 rounded-xl p-6 shadow-sm', className)}>
      {children}
    </div>
  );
}

// Use 'use client' only when needed
'use client';
import { useState } from 'react';
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Rules
- Default to **Server Components** — add `'use client'` only for interactivity, browser APIs, hooks.
- Use `<Image>` from `next/image` for all images — automatic optimization, lazy loading, `alt` required.
- Use `<Link>` from `next/link` for all internal navigation — never `<a href>` for same-domain.
- Metadata: export `metadata` object from each page for SEO — never set `<title>` in JSX directly.
- Route groups `(group)/` for layout sharing without URL segments.
- Loading UI: `loading.tsx` at each route level for streaming suspense.
- Error boundaries: `error.tsx` at each route level.

### Common AI Mistakes
- Mixing Server and Client component patterns (e.g., using `useState` in a Server Component).
- Forgetting `alt` on `<Image>` — required prop.
- Using `getServerSideProps` (Pages Router API) in App Router — doesn't exist.
- Not wrapping `useSearchParams()` in `<Suspense>`.
- Fetching the same data multiple times instead of using `fetch` with Next.js caching.

---

## 4 — Vue 3 (Composition API)

**Use for:** Progressive web apps, teams coming from Vue 2, component-heavy applications.

### Component Pattern
```vue
<template>
  <button
    :class="[baseClasses, variantClasses[variant], sizeClasses[size]]"
    :disabled="disabled"
    type="button"
    @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
defineEmits(['click'])

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
const variantClasses = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400',
  secondary: 'border border-neutral-300 hover:bg-neutral-50 text-neutral-900 focus:ring-neutral-400',
  ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-400',
}
const sizeClasses = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
</script>
```

### Rules
- `<script setup>` syntax (Composition API) — not Options API for new code.
- `defineProps` with TypeScript generics for type-safe props.
- `v-for` always requires `:key` with stable, unique value.
- Use `computed()` for derived state, not methods that run on every render.
- `v-model` for two-way binding on form inputs.
- Avoid `v-html` — XSS risk. Use `DOMPurify` if unavoidable.

### Common AI Mistakes
- Using Options API (`data()`, `methods:`) when Composition API is available.
- Missing `:key` on `v-for`.
- Accessing DOM directly with `document.querySelector` — use `ref` instead.
- Mutating props directly — always emit events.

---

## 5 — Nuxt.js 3

**Use for:** SSR/SSG sites, SEO-heavy applications, Vue-based full-stack.

### Rules
- `<NuxtLink>` for all internal navigation (not `<a>`).
- `<NuxtImg>` for images (requires `@nuxt/image` module).
- `useFetch()` / `useAsyncData()` for data fetching — not raw `fetch()` in setup.
- `useHead()` or `<Head>` component for meta tags on each page.
- Auto-imports: components, composables, and utils in their respective directories are auto-imported.
- `server/api/` for API routes (Nitro server).

### Common AI Mistakes
- Using Vue Router's `useRouter` instead of Nuxt's `useRouter` / `navigateTo`.
- Forgetting that Nuxt auto-imports — don't manually import components from `~/components/`.
- Using `<head>` directly in template — use `<Head>` component or `useHead()`.

---

## 6 — Angular

**Use for:** Enterprise applications, teams with Java/C# backgrounds, large-scale SPAs.

### Component Pattern
```typescript
// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="clicked.emit()"
      type="button">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants: Record<string, string> = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400',
      secondary: 'border border-neutral-300 hover:bg-neutral-50 text-neutral-900',
      ghost: 'hover:bg-neutral-100 text-neutral-700',
    };
    return `${base} ${variants[this.variant]} px-5 py-2.5 text-sm`;
  }
}
```

### Rules
- Use standalone components (Angular 14+) — not `NgModule` for new code.
- `OnPush` change detection for performance-sensitive components.
- Use Angular's `HttpClient` not `fetch` — interceptors, error handling, type safety.
- Template-driven forms for simple; Reactive forms (`FormBuilder`) for complex.
- Use `AsyncPipe` in templates for observables — auto-unsubscribes.
- Accessibility: use CDK A11y (`FocusTrap`, `LiveAnnouncer`) for complex interactive patterns.

---

## 7 — Svelte / SvelteKit

**Use for:** Performance-critical sites, smaller bundle requirements, modern full-stack.

### Component Pattern
```svelte
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let disabled = false;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<button
  class={`inline-flex items-center justify-center font-medium rounded-lg transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variant === 'primary' ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400 px-5 py-2.5' : ''}
    ${variant === 'secondary' ? 'border border-neutral-300 hover:bg-neutral-50 text-neutral-900 px-5 py-2.5' : ''}
    ${variant === 'ghost' ? 'hover:bg-neutral-100 text-neutral-700 px-5 py-2.5' : ''}`}
  {disabled}
  on:click={() => dispatch('click')}
  type="button">
  <slot />
</button>
```

### Rules
- Reactive declarations with `$:` for derived values.
- `bind:` for two-way binding on form elements.
- Svelte transitions (`fade`, `slide`, `fly`) — always check `prefers-reduced-motion`.
- SvelteKit: use `load()` in `+page.ts` / `+page.server.ts` for data. Never fetch in component mount.
- Named slots for flexible component composition.

---

## 8 — Astro

**Use for:** Content sites, blogs, marketing pages, multi-framework islands.

### Rules
- Default to **zero JavaScript** — add `client:` directive only for interactive islands.
- `client:load` — hydrates immediately. `client:visible` — hydrates when in viewport. `client:idle` — hydrates when browser is idle.
- Use `<Image>` from `astro:assets` for optimized images.
- Content Collections for type-safe markdown/MDX content.
- `Astro.props` for component props, typed with `Props` interface.
- Can mix React, Vue, Svelte components — use the right tool for each island.

### Common AI Mistakes
- Adding `client:load` to every component — defeats Astro's performance benefit.
- Not using Content Collections for blog/docs content.
- Using React hooks in `.astro` files — not supported.

---

## 9 — Remix

**Use for:** Full-stack React apps, progressive enhancement, form-heavy applications.

### Rules
- `loader()` for all data fetching — runs server-side, type-safe with `LoaderFunctionArgs`.
- `action()` for all mutations — replaces `fetch POST` from components.
- Forms submit to `action()` — works without JavaScript (progressive enhancement).
- `useLoaderData()` to consume loader data in components.
- Error boundaries: `ErrorBoundary` export on each route.
- Nested routes compose layouts automatically.
- Use `<Form>` from `@remix-run/react` not `<form>` for enhanced forms.

---

## 10 — SolidJS

**Use for:** High-performance SPAs, fine-grained reactivity needs.

### Rules
- Reactive primitives: `createSignal`, `createMemo`, `createEffect`.
- No virtual DOM — updates are surgical. Don't think in "re-renders".
- `<For>` component instead of `.map()` for lists (fine-grained updates).
- `<Show>` instead of ternary for conditional rendering.
- `createStore` for complex nested state.
- Solid's JSX is different from React's — no `key` prop needed on `<For>`.

---

## 11 — React Native (Expo)

**Use for:** Cross-platform iOS + Android apps.

### Component Pattern
```tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Button({ title, onPress, variant = 'primary', disabled, accessibilityLabel }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}>
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, alignItems: 'center', minHeight: 44 },
  primary: { backgroundColor: '#4361EE' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D5DB' },
  disabled: { opacity: 0.5 },
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  textSecondary: { color: '#111827' },
});
```

### Rules
- Minimum touch target: **44×44pt** (Apple HIG) — use `minHeight: 44, minWidth: 44`.
- Always provide `accessibilityLabel` and `accessibilityRole` on interactive elements.
- `TouchableOpacity` over `Pressable` for simpler cases; `Pressable` for complex press states.
- Use `StyleSheet.create()` — not inline objects (performance).
- `ScrollView` for short lists; `FlatList`/`FlashList` for long dynamic lists.
- `KeyboardAvoidingView` for forms.
- Safe area: use `useSafeAreaInsets()` or `SafeAreaView` — never hardcode status bar height.

### Common AI Mistakes
- Using CSS selectors/classes (not supported in RN).
- `<div>`, `<span>`, `<img>` — use `<View>`, `<Text>`, `<Image>`.
- Not handling keyboard avoid on form screens.
- Touch targets smaller than 44pt.
- Missing `accessibilityRole` on interactive elements.

---

## 12 — Flutter

**Use for:** Cross-platform iOS + Android + web apps with native performance.

### Component Pattern
```dart
// Primary button widget
class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonVariant variant;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = ButtonVariant.primary,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      height: 48,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: variant == ButtonVariant.primary
              ? theme.colorScheme.primary
              : Colors.transparent,
          foregroundColor: variant == ButtonVariant.primary
              ? theme.colorScheme.onPrimary
              : theme.colorScheme.primary,
          side: variant == ButtonVariant.secondary
              ? BorderSide(color: theme.colorScheme.outline)
              : null,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(horizontal: 20),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      ),
    );
  }
}
enum ButtonVariant { primary, secondary }
```

### Rules
- Use `ThemeData` with `ColorScheme.fromSeed()` for consistent theming.
- `Material 3` (`useMaterial3: true`) for modern design language.
- Minimum touch target: 48×48dp — use `SizedBox` or `ConstrainedBox` to enforce.
- `Semantics` widget for custom accessibility labels.
- `const` constructors wherever possible — reduces rebuilds.
- `ListView.builder` for long lists — not `ListView` with `children:`.

---

## 13 — SwiftUI

**Use for:** Native iOS, macOS, tvOS, watchOS, visionOS applications.

### Component Pattern
```swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isDisabled: Bool = false

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .padding(.horizontal, 20)
        }
        .background(Color.accentColor)
        .cornerRadius(8)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1.0)
        .accessibilityLabel(title)
    }
}
```

### Rules
- Use `@State`, `@Binding`, `@StateObject`, `@ObservedObject`, `@EnvironmentObject` correctly.
- Follow Apple HIG: min 44×44pt touch target, Dynamic Type support required.
- `accessibilityLabel` and `accessibilityHint` on interactive elements.
- `@ViewBuilder` for conditional view composition.
- `SF Symbols` for icons — consistent with system UI.
- Support `preferredColorScheme` — do not hard-code light/dark colors.

---

## 14 — shadcn/ui (React + Radix)

**Use for:** React/Next.js apps requiring a pre-built accessible component library.

### Rules
- Install components with `npx shadcn-ui@latest add [component]` — they're copied to your project and owned by you.
- Customize via `tailwind.config.ts` theme extension and `globals.css` CSS variables.
- Base primitives come from Radix UI — keyboard navigation and ARIA already handled.
- Use `cn()` utility from `lib/utils.ts` for class merging.
- Override styles via `className` prop — never modify `components/ui/` files directly.

### CSS Variable Pattern (globals.css)
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

### Common AI Mistakes
- Editing `components/ui/` files — defeats the copy-owned model.
- Using HSL shorthand wrong for shadcn variables (they're space-separated, not comma-separated).
- Not running `npx shadcn-ui init` first.

---

## 15 — Jetpack Compose (Android)

**Use for:** Native Android applications.

### Rules
- Stateless composables where possible — pass state down, events up.
- `remember {}` for local state, `rememberSaveable {}` for state that survives recomposition.
- `LazyColumn` / `LazyRow` for scrollable lists — not `Column` with map.
- Material 3 (`androidx.compose.material3`): `MaterialTheme.colorScheme`, `MaterialTheme.typography`.
- Minimum touch target: 48×48dp — `Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)`.
- `Modifier.semantics` for custom accessibility.
- Avoid side effects in composable functions — use `LaunchedEffect`, `SideEffect`, `DisposableEffect`.

---

## 16 — Laravel (Blade + Tailwind)

**Use for:** PHP-based web apps, traditional server-rendered with Tailwind.

### Rules
- Use Blade components (`<x-button>`, `<x-card>`) for reusable UI.
- `{{ $variable }}` for escaped output (XSS safe). `{!! $html !!}` only for trusted HTML.
- CSRF: `@csrf` in every POST form — required.
- Livewire for reactive components without writing JavaScript.
- Alpine.js for lightweight interactivity in Blade.
- Vite for asset bundling (`vite.config.js` + `@vite()` directive).
- `route()` helper for all URL generation — never hardcode paths.

---

## Universal Rules (All Stacks)

Regardless of stack, always apply:

```
UNIVERSAL CHECKLIST
[ ] Semantic HTML structure (nav, main, section, article, aside, footer)
[ ] All images have meaningful alt text
[ ] All interactive elements reachable by keyboard (Tab order)
[ ] Focus states visible and not removed with outline: none
[ ] ARIA labels on icon-only buttons and custom interactive widgets
[ ] prefers-reduced-motion: wrap all CSS/JS animations
[ ] Color not the only differentiator for any meaning
[ ] Min touch target 44×44px (web) / 44pt (iOS) / 48dp (Android)
[ ] Error messages identify the field + state the recovery action
[ ] Loading states shown for async operations > 300ms
```
