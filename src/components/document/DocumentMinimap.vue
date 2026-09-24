<script setup lang="ts">
import { ref } from 'vue'
import type { TocHeading } from '@/types/workspace'

const props = defineProps<{ items: TocHeading[]; activeId: string }>()
const emit = defineEmits<{ select: [id: string] }>()
const hoveredIndex = ref<number | null>(null)

function lineStyle(index: number): Record<string, string> {
  if (hoveredIndex.value === null) {
    return {
      '--minimap-line-width': '6px',
      '--minimap-line-shift': '0px',
    }
  }

  const distance = Math.abs(index - hoveredIndex.value)
  const influence = Math.max(0, 4 - distance)
  return {
    '--minimap-line-width': `${6 + influence * 5.5}px`,
    '--minimap-line-shift': `${influence * 2.5}px`,
  }
}

function resetHover(event: FocusEvent): void {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !event.currentTarget || !(event.currentTarget as HTMLElement).contains(next)) {
    hoveredIndex.value = null
  }
}
</script>

<template>
  <nav
    v-if="items.length"
    class="document-minimap"
    aria-label="文档章节导航"
    @mouseleave="hoveredIndex = null"
    @focusout="resetHover"
  >
    <button
      v-for="(item, index) in items"
      :key="item.id"
      type="button"
      :class="[`minimap-level-${item.level}`, { active: item.id === activeId }]"
      :style="lineStyle(index)"
      :aria-label="`跳转到章节：${item.text}`"
      :aria-current="item.id === activeId ? 'location' : undefined"
      :data-label="item.text"
      :title="item.text"
      @mouseenter="hoveredIndex = index"
      @focus="hoveredIndex = index"
      @click="emit('select', item.id)"
    >
      <span aria-hidden="true" />
    </button>
  </nav>
</template>
