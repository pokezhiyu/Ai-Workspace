<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; save: [] }>()
const editor = ref<HTMLTextAreaElement | null>(null)
const lines = computed(() => props.modelValue.split('\n').length)
const words = computed(() => props.modelValue.trim().split(/\s+/).filter(Boolean).length)

function handleKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    emit('save')
  }
  if (event.key === 'Tab') {
    event.preventDefault()
    const input = editor.value
    if (!input) return
    const start = input.selectionStart
    const end = input.selectionEnd
    const next = `${props.modelValue.slice(0, start)}  ${props.modelValue.slice(end)}`
    emit('update:modelValue', next)
    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = start + 2
    })
  }
}
</script>

<template>
  <div class="markdown-editor">
    <textarea
      ref="editor"
      :value="modelValue"
      spellcheck="true"
      aria-label="Markdown 源码编辑器"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown="handleKeydown"
    />
    <footer><span>Markdown</span><span>{{ lines }} 行 · {{ words }} 词</span><span>Ctrl S 保存</span></footer>
  </div>
</template>
