<script setup lang="ts">
import FileText from '@lucide/vue/dist/esm/icons/file-text.mjs'
import type { SearchResult } from '@/types/workspace'
import { documentStatusLabel, documentTypeLabel } from '@/utils/labels'

defineProps<{ results: SearchResult[]; query: string; selectedIndex: number }>()
const emit = defineEmits<{ select: [result: SearchResult]; hover: [index: number] }>()
</script>

<template>
  <div class="knowledge-results">
    <div class="knowledge-results-count">{{ results.length }} 个结果</div>
    <button
      v-for="(result, index) in results"
      :key="`${result.path}-${result.heading?.id ?? ''}`"
      type="button"
      :class="{ selected: index === selectedIndex }"
      @mouseenter="emit('hover', index)"
      @click="emit('select', result)"
    >
      <FileText :size="14" />
      <span class="knowledge-result-copy">
        <strong>{{ result.title }}</strong>
        <small>{{ result.path }}</small>
        <span>{{ documentTypeLabel(result.metadata.type) }} · {{ documentStatusLabel(result.metadata.status) }}</span>
        <em v-if="result.excerpt">{{ result.excerpt }}</em>
      </span>
    </button>
    <div v-if="results.length === 0" class="knowledge-search-empty">没有找到“{{ query }}”相关文档</div>
  </div>
</template>
