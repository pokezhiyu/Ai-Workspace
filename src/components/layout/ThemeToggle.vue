<script setup lang="ts">
import Monitor from '@lucide/vue/dist/esm/icons/monitor.mjs'
import Moon from '@lucide/vue/dist/esm/icons/moon.mjs'
import Sun from '@lucide/vue/dist/esm/icons/sun.mjs'
import { ref } from 'vue'
import { useTheme, type ThemeMode } from '@/composables/useTheme'

const { mode, setTheme } = useTheme()
const open = ref(false)

const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
]

function choose(value: ThemeMode): void {
  setTheme(value)
  open.value = false
}
</script>

<template>
  <div class="theme-control">
    <button class="header-action" type="button" aria-label="选择主题" @click="open = !open">
      <Sun v-if="mode === 'light'" :size="15" />
      <Moon v-else-if="mode === 'dark'" :size="15" />
      <Monitor v-else :size="15" />
      <span class="header-action-label">{{ options.find((option) => option.value === mode)?.label }}</span>
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="dropdown theme-menu">
        <button v-for="option in options" :key="option.value" type="button" :class="{ active: mode === option.value }" @click="choose(option.value)">
          <component :is="option.icon" :size="15" />
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
