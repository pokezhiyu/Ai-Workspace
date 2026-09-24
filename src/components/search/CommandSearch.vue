<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ArrowRight from '@lucide/vue/dist/esm/icons/arrow-right.mjs'
import FileText from '@lucide/vue/dist/esm/icons/file-text.mjs'
import Search from '@lucide/vue/dist/esm/icons/search.mjs'
import X from '@lucide/vue/dist/esm/icons/x.mjs'
import { useWorkspaceStore } from '@/stores/workspace'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; select: [path: string] }>()
const store = useWorkspaceStore()
const query = ref('')
const selectedIndex = ref(0)
const input = ref<HTMLInputElement | null>(null)
const results = computed(() => store.search(query.value))

watch(() => props.open, async (open) => {
  if (!open) return
  query.value = ''
  selectedIndex.value = 0
  await nextTick()
  input.value?.focus()
})
watch(query, () => { selectedIndex.value = 0 })

function choose(path: string): void {
  emit('select', path)
  emit('close')
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (event.key === 'Enter') {
    const result = results.value[selectedIndex.value]
    if (result) choose(result.path)
  } else if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="command">
      <div v-if="open" class="command-layer" @mousedown.self="emit('close')">
        <section class="command-panel" role="dialog" aria-modal="true" aria-label="搜索 Workspace" @keydown="handleKeydown">
          <div class="command-input">
            <Search :size="17" />
            <input ref="input" v-model="query" placeholder="搜索标题、路径、正文或 Metadata…" />
            <button type="button" aria-label="关闭搜索" @click="emit('close')"><X :size="15" /></button>
          </div>
          <div class="command-results">
            <div class="command-section-label">{{ query ? `${results.length} 个结果` : '最近文档' }}</div>
            <button
              v-for="(result, index) in results"
              :key="result.path"
              type="button"
              :class="{ selected: index === selectedIndex }"
              @mouseenter="selectedIndex = index"
              @click="choose(result.path)"
            >
              <span class="result-icon"><FileText :size="16" /></span>
              <span class="result-copy">
                <strong>{{ result.title }}</strong>
                <small>{{ result.path }}</small>
                <em v-if="result.excerpt">{{ result.excerpt }}</em>
              </span>
              <ArrowRight :size="14" />
            </button>
            <div v-if="results.length === 0" class="command-empty">没有找到“{{ query }}”相关文档</div>
          </div>
          <footer><span><kbd>↑</kbd><kbd>↓</kbd> 选择</span><span><kbd>↵</kbd> 打开</span><span><kbd>Esc</kbd> 关闭</span></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
