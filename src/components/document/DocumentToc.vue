<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ListTree from '@lucide/vue/dist/esm/icons/list-tree.mjs'
import type { TocHeading } from '@/types/workspace'

const props = defineProps<{ items: TocHeading[]; activeId: string }>()
const emit = defineEmits<{ select: [id: string] }>()
const list = ref<HTMLElement | null>(null)

watch(() => props.activeId, async (id) => {
  if (!id) return
  await nextTick()
  list.value?.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <section class="document-toc">
    <h3><ListTree :size="13" />本页目录</h3>
    <nav ref="list" aria-label="本页目录">
      <button
        v-for="item in props.items"
        :key="item.id"
        type="button"
        :data-toc-id="item.id"
        :class="[`toc-level-${item.level}`, { active: item.id === activeId }]"
        @click="emit('select', item.id)"
      >{{ item.text }}</button>
      <p v-if="props.items.length === 0" class="muted">本文档暂无章节</p>
    </nav>
  </section>
</template>
