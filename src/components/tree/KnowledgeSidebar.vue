<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import FilePlus2 from '@lucide/vue/dist/esm/icons/file-plus.mjs'
import FolderPlus from '@lucide/vue/dist/esm/icons/folder-plus.mjs'
import PanelLeftClose from '@lucide/vue/dist/esm/icons/panel-left-close.mjs'
import RotateCcw from '@lucide/vue/dist/esm/icons/rotate-ccw.mjs'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import KnowledgeTree from './KnowledgeTree.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { TreeAction, TreeDropPosition, WorkspaceTreeNode } from '@/types/workspace'
import { dirname } from '@/utils/path'
import { useToast } from '@/composables/useToast'
import KnowledgeSearch from '@/components/search/KnowledgeSearch.vue'
import SearchResults from '@/components/search/SearchResults.vue'
import type { SearchResult } from '@/types/workspace'
import SidebarResizeHandle from '@/components/layout/SidebarResizeHandle.vue'

defineProps<{ focusToken: number; mobileOpen?: boolean }>()
const emit = defineEmits<{ open: [path: string, anchor?: string]; collapse: []; closeMobile: [] }>()
const store = useWorkspaceStore()
const { toast } = useToast()
const dialog = ref<'new-document' | 'new-folder' | 'delete' | 'move' | null>(null)
const target = ref<WorkspaceTreeNode | null>(null)
const inputValue = ref('')
const query = ref('')
const selectedIndex = ref(0)
const moveDestination = ref('')
const moveSelect = ref<HTMLSelectElement | null>(null)
const results = computed(() => store.search(query.value))
const moveFolders = computed(() => store.entries
  .filter((entry) => entry.kind === 'folder' && !store.isHarnessPath(entry.path))
  .filter((entry) => !target.value || (entry.path !== target.value.path && !entry.path.startsWith(`${target.value.path}/`)))
  .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' })))
watch(query, () => { selectedIndex.value = 0 })

function chooseResult(result: SearchResult): void {
  query.value = ''
  store.expandAncestors(result.path)
  emit('open', result.path, result.heading?.id)
  emit('closeMobile')
}

function handleSearchKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (results.value.length) selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (event.key === 'Enter') {
    const result = results.value[selectedIndex.value]
    if (result) chooseResult(result)
  } else if (event.key === 'Escape') query.value = ''
}

async function begin(action: 'new-document' | 'new-folder' | 'delete' | 'move', node?: WorkspaceTreeNode): Promise<void> {
  dialog.value = action
  target.value = node ?? null
  inputValue.value = ''
  if (action === 'move' && node) {
    moveDestination.value = dirname(node.path)
    await nextTick()
    moveSelect.value?.focus()
  }
}

function closeDialog(): void {
  dialog.value = null
  target.value = null
}

async function submitCreate(): Promise<void> {
  if (!inputValue.value.trim() || !dialog.value) return
  try {
    const base = target.value?.kind === 'folder' ? target.value.path : target.value ? dirname(target.value.path) : 'docs'
    if (dialog.value === 'new-document') {
      const path = await store.createDocument(base, inputValue.value)
      toast({ title: '文档已创建', description: path })
      emit('open', path)
    } else if (dialog.value === 'new-folder') {
      const path = await store.createFolder(base, inputValue.value)
      toast({ title: '文件夹已创建', description: path })
    }
    closeDialog()
  } catch (error) {
    toast({ title: '创建失败', description: error instanceof Error ? error.message : '未知错误', tone: 'danger' })
  }
}

async function confirmDelete(): Promise<void> {
  if (!target.value) return
  try {
    const name = target.value.name
    await store.deleteEntry(target.value.path)
    toast({ title: `${target.value.kind === 'folder' ? '文件夹' : '文档'}已删除`, description: name })
    closeDialog()
  } catch (error) {
    toast({ title: '删除失败', description: error instanceof Error ? error.message : '未知错误', tone: 'danger' })
  }
}

async function syncActiveRoute(previousActivePath: string): Promise<void> {
  if (store.activePath && store.activePath !== previousActivePath) emit('open', store.activePath)
}

async function submitMove(): Promise<void> {
  if (!target.value) return
  const previousActivePath = store.activePath
  try {
    const nextPath = await store.moveEntryToFolder(target.value.path, moveDestination.value)
    toast({ title: '已移动', description: nextPath })
    closeDialog()
    await syncActiveRoute(previousActivePath)
  } catch (error) {
    toast({ title: '移动失败', description: error instanceof Error ? error.message : '未知错误', tone: 'danger' })
  }
}

async function handleMove(sourcePath: string, targetPath: string | null, position: TreeDropPosition): Promise<void> {
  const previousActivePath = store.activePath
  try {
    const nextPath = await store.moveEntry(sourcePath, targetPath, position)
    toast({ title: position === 'inside' ? '已移入文件夹' : '顺序已更新', description: nextPath })
    await syncActiveRoute(previousActivePath)
  } catch (error) {
    toast({ title: '移动失败', description: error instanceof Error ? error.message : '未知错误', tone: 'danger' })
  }
}

async function handleAction(action: TreeAction, node: WorkspaceTreeNode): Promise<void> {
  if (action === 'new-document' || action === 'new-folder' || action === 'delete') {
    begin(action, node)
    return
  }
  if (action === 'move-to-folder') {
    begin('move', node)
    return
  }
  const previousActivePath = store.activePath
  try {
    if (action === 'rename') {
      const nextPath = await store.renameEntry(node.path, node.name)
      toast({ title: '已重命名', description: nextPath })
      emit('open', nextPath)
    } else if (action === 'duplicate') {
      const path = await store.duplicateDocument(node.path)
      toast({ title: '文档已创建副本', description: path })
      emit('open', path)
    } else if (action === 'move-up' || action === 'move-down') {
      const nextPath = await store.moveEntryByOffset(node.path, action === 'move-up' ? -1 : 1)
      toast({ title: action === 'move-up' ? '已上移' : '已下移', description: nextPath })
      await syncActiveRoute(previousActivePath)
    } else if (action === 'move-parent') {
      const nextPath = await store.moveEntryToParent(node.path)
      toast({ title: '已移到上一级', description: nextPath })
      await syncActiveRoute(previousActivePath)
    } else {
      await navigator.clipboard.writeText(node.path)
      toast({ title: '路径已复制', description: node.path })
    }
  } catch (error) {
    toast({ title: '操作失败', description: error instanceof Error ? error.message : '未知错误', tone: 'danger' })
  }
}
</script>

<template>
  <aside class="knowledge-sidebar" :class="{ 'mobile-drawer-open': mobileOpen }">
    <div class="sidebar-heading">
      <div>
        <span class="eyebrow">Workspace</span>
        <h2>项目知识</h2>
      </div>
      <button class="icon-button" type="button" aria-label="收起知识侧栏" @click="emit('collapse')">
        <PanelLeftClose :size="16" />
      </button>
    </div>
    <div class="sidebar-actions">
      <button type="button" @click="begin('new-document')"><FilePlus2 :size="14" />新建文档</button>
      <button type="button" @click="begin('new-folder')"><FolderPlus :size="14" />新建文件夹</button>
    </div>
    <KnowledgeSearch v-model="query" :focus-token="focusToken" @keydown="handleSearchKeydown" />
    <div class="tree-scroll">
      <SearchResults v-if="query" :results="results" :query="query" :selected-index="selectedIndex" @hover="selectedIndex = $event" @select="chooseResult" />
      <KnowledgeTree v-else :nodes="store.tree" @open="emit('open', $event)" @action="handleAction" @move="handleMove" />
    </div>
    <div class="sidebar-footer">
      <RotateCcw :size="13" />
      <span>已存储到本地</span>
      <span class="live-dot" />
    </div>
    <SidebarResizeHandle
      :value="store.sidebarWidth"
      @resize="store.setSidebarWidth"
      @resize-end="store.persistSidebarWidth"
    />
  </aside>

  <BaseDialog
    :open="dialog === 'new-document' || dialog === 'new-folder'"
    :title="dialog === 'new-folder' ? '新建文件夹' : '新建文档'"
    :description="target ? `创建于 ${target.path}` : '创建于 docs'"
    @close="closeDialog"
  >
    <form class="dialog-form" @submit.prevent="submitCreate">
      <label>
        {{ dialog === 'new-folder' ? '文件夹名称' : '文档标题' }}
        <input v-model="inputValue" autofocus :placeholder="dialog === 'new-folder' ? 'research' : 'API Design'" />
      </label>
      <div class="dialog-actions">
        <button class="button secondary" type="button" @click="closeDialog">取消</button>
        <button class="button primary" type="submit" :disabled="!inputValue.trim()">创建</button>
      </div>
    </form>
  </BaseDialog>

  <BaseDialog
    :open="dialog === 'move'"
    title="移动项目"
    :description="target ? `选择 ${target.name} 的目标文件夹` : '选择目标文件夹'"
    @close="closeDialog"
  >
    <form class="dialog-form" @submit.prevent="submitMove">
      <label>
        目标文件夹
        <select ref="moveSelect" v-model="moveDestination">
          <option value="">Workspace 根目录</option>
          <option v-for="folder in moveFolders" :key="folder.path" :value="folder.path">{{ folder.path }}</option>
        </select>
      </label>
      <div class="dialog-actions">
        <button class="button secondary" type="button" @click="closeDialog">取消</button>
        <button class="button primary" type="submit">移动</button>
      </div>
    </form>
  </BaseDialog>

  <BaseDialog
    :open="dialog === 'delete'"
    title="确定删除这个项目？"
    :description="target?.kind === 'folder' ? '其中的所有文档和文件夹也会被删除。' : '该文档将从本地存储中删除。'"
    @close="closeDialog"
  >
    <div class="delete-summary">{{ target?.path }}</div>
    <div class="dialog-actions">
      <button class="button secondary" type="button" @click="closeDialog">取消</button>
      <button class="button danger-button" type="button" @click="confirmDelete">删除</button>
    </div>
  </BaseDialog>
</template>
