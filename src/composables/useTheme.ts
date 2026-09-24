import { computed, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'ai-coding-workspace:theme'
const mode = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system')
let initialized = false

function applyTheme(): void {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = mode.value === 'dark' || (mode.value === 'system' && systemDark)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export function useTheme() {
  if (!initialized) {
    initialized = true
    applyTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
  }

  function setTheme(next: ThemeMode): void {
    mode.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme()
  }

  return { mode: computed(() => mode.value), setTheme }
}
