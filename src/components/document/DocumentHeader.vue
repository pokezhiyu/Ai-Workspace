<script setup lang="ts">
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import Clock3 from '@lucide/vue/dist/esm/icons/clock-3.mjs'
import Save from '@lucide/vue/dist/esm/icons/save.mjs'
import LockKeyhole from '@lucide/vue/dist/esm/icons/lock-keyhole.mjs'
import type { SaveState, WorkspaceDocument } from '@/types/workspace'
import { formatDocumentDate } from '@/utils/document'
import { documentStatusLabel, documentTypeLabel } from '@/utils/labels'

defineProps<{ document: WorkspaceDocument; mode: 'read' | 'edit'; saveState: SaveState; writable: boolean }>()
const emit = defineEmits<{ mode: [mode: 'read' | 'edit']; save: [] }>()

</script>

<template>
  <header class="document-header">
    <div class="document-title-block">
      <h1>{{ document.metadata.title }}</h1>
      <div class="document-subtitle">
        <span>{{ documentTypeLabel(document.metadata.type) }}</span>
        <span aria-hidden="true">·</span>
        <span>v{{ document.metadata.version ?? '0.1.0' }}</span>
        <span aria-hidden="true">·</span>
        <span class="status-badge" :data-status="document.metadata.status ?? 'draft'">{{ documentStatusLabel(document.metadata.status) }}</span>
      </div>
      <div class="updated-line"><Clock3 :size="13" />更新于 {{ formatDocumentDate(document.metadata.updated) }}</div>
    </div>
    <div class="document-controls">
      <span v-if="!writable" class="document-readonly" title="当前角色可以阅读，但不能修改此空间"><LockKeyhole :size="12" />只读</span>
      <div class="mode-switch" aria-label="文档模式">
        <button type="button" :class="{ active: mode === 'read' }" @click="emit('mode', 'read')">阅读</button>
        <button type="button" :class="{ active: mode === 'edit' }" :disabled="!writable" :title="writable ? '编辑文档' : '当前角色没有此空间的编辑权限'" @click="emit('mode', 'edit')">编辑</button>
      </div>
      <button v-if="mode === 'edit'" class="button save-button" type="button" :disabled="saveState === 'saving'" @click="emit('save')">
        <Check v-if="saveState === 'saved'" :size="14" />
        <Save v-else :size="14" />
        {{ saveState === 'saving' ? '正在保存…' : saveState === 'saved' ? '已保存' : '保存' }}
      </button>
    </div>
  </header>
</template>
