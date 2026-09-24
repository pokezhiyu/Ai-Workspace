<script setup lang="ts">
import CalendarDays from '@lucide/vue/dist/esm/icons/calendar-days.mjs'
import ChevronRight from '@lucide/vue/dist/esm/icons/chevron-right.mjs'
import CircleUserRound from '@lucide/vue/dist/esm/icons/circle-user-round.mjs'
import GitCommitHorizontal from '@lucide/vue/dist/esm/icons/git-commit-horizontal.mjs'
import Link2 from '@lucide/vue/dist/esm/icons/link-2.mjs'
import PanelRightClose from '@lucide/vue/dist/esm/icons/panel-right-close.mjs'
import Tag from '@lucide/vue/dist/esm/icons/tag.mjs'
import { computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { formatDocumentDate } from '@/utils/document'
import { documentStatusLabel } from '@/utils/labels'
import DocumentToc from './DocumentToc.vue'

const emit = defineEmits<{ navigate: [path: string]; collapse: [] }>()
defineProps<{ mobileOpen?: boolean }>()
const store = useWorkspaceStore()
const document = computed(() => store.activeDocument)

function relatedPath(id: string): string | undefined {
  return store.findPathByDocumentId(id)
}

function goRelated(id: string): void {
  const path = relatedPath(id)
  if (path) emit('navigate', path)
}
</script>

<template>
  <aside class="document-context" :class="{ 'mobile-drawer-open': mobileOpen }">
    <div class="context-heading">
      <div><span class="eyebrow">Document</span><h2>文档导航</h2></div>
      <button class="icon-button" type="button" aria-label="收起文档导航" @click="emit('collapse')"><PanelRightClose :size="16" /></button>
    </div>
    <div v-if="document" class="context-content">
      <DocumentToc :items="store.tocHeadings" :active-id="store.activeHeadingId" @select="store.navigateToHeading" />
      <div class="context-divider" />
      <h3 class="document-meta-heading">文档信息</h3>
      <section>
        <h3><Tag :size="13" />状态</h3>
        <p><span class="status-badge" :data-status="document.metadata.status ?? 'draft'">{{ documentStatusLabel(document.metadata.status) }}</span></p>
      </section>
      <section>
        <h3><GitCommitHorizontal :size="13" />版本</h3>
        <p>{{ document.metadata.version ?? '未设置' }}</p>
      </section>
      <section>
        <h3><CircleUserRound :size="13" />负责人</h3>
        <p>{{ document.metadata.owner ?? '未分配' }}</p>
      </section>
      <section>
        <h3><CalendarDays :size="13" />更新时间</h3>
        <p>{{ formatDocumentDate(document.metadata.updated, true) }}</p>
      </section>
      <section class="context-related">
        <h3><Link2 :size="13" />关联文档</h3>
        <div v-if="document.metadata.related.length" class="related-list">
          <button
            v-for="id in document.metadata.related"
            :key="id"
            type="button"
            :disabled="!relatedPath(id)"
            @click="goRelated(id)"
          >
            <span><strong>{{ relatedPath(id) ? store.titleForPath(relatedPath(id)!) : id }}</strong><small>{{ id }}</small></span>
            <ChevronRight :size="14" />
          </button>
        </div>
        <p v-else class="muted">暂无关联文档</p>
      </section>
      <section class="context-path">
        <h3>文件路径</h3>
        <code>{{ document.path }}</code>
      </section>
    </div>
  </aside>
</template>
