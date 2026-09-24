<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Search from '@lucide/vue/dist/esm/icons/search.mjs'
import X from '@lucide/vue/dist/esm/icons/x.mjs'

const props = defineProps<{ modelValue: string; focusToken: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; keydown: [event: KeyboardEvent] }>()
const input = ref<HTMLInputElement | null>(null)
const shortcutLabel = computed(() => /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K')

watch(() => props.focusToken, async () => {
  await nextTick()
  input.value?.focus()
  input.value?.select()
})

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="knowledge-search">
    <Search :size="14" />
    <input
      ref="input"
      :value="modelValue"
      placeholder="搜索知识..."
      aria-label="搜索项目知识"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="emit('keydown', $event)"
    />
    <button v-if="modelValue" type="button" aria-label="清空搜索" @click="emit('update:modelValue', '')"><X :size="13" /></button>
    <kbd v-else>{{ shortcutLabel }}</kbd>
  </div>
</template>
