<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import X from '@lucide/vue/dist/esm/icons/x.mjs'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  description?: string
  width?: 'sm' | 'md' | 'lg'
  dismissible?: boolean
}>(), {
  dismissible: true,
})

const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function requestClose(): void {
  if (props.dismissible) emit('close')
}

function focusableElements(): HTMLElement[] {
  if (!panel.value) return []
  return Array.from(panel.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hasAttribute('hidden'))
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    requestClose()
    return
  }
  if (event.key !== 'Tab') return
  const elements = focusableElements()
  if (!elements.length) {
    event.preventDefault()
    panel.value?.focus()
    return
  }
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      focusableElements()[0]?.focus()
      return
    }
    previouslyFocused?.focus()
    previouslyFocused = null
  },
)

onBeforeUnmount(() => previouslyFocused?.focus())
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="dialog-layer" @mousedown.self="requestClose">
        <section
          ref="panel"
          class="dialog-panel"
          :class="`dialog-panel--${width ?? 'sm'}`"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          @keydown="handleKeydown"
        >
          <header class="dialog-header">
            <div>
              <h2>{{ title }}</h2>
              <p v-if="description">{{ description }}</p>
            </div>
            <button v-if="dismissible" class="icon-button" type="button" aria-label="关闭对话框" @click="requestClose">
              <X :size="16" />
            </button>
          </header>
          <slot />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
