<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import ChevronRight from '@lucide/vue/dist/esm/icons/chevron-right.mjs'
import Clipboard from '@lucide/vue/dist/esm/icons/clipboard.mjs'
import Copy from '@lucide/vue/dist/esm/icons/copy.mjs'
import FilePlus2 from '@lucide/vue/dist/esm/icons/file-plus.mjs'
import File from '@lucide/vue/dist/esm/icons/file.mjs'
import Folder from '@lucide/vue/dist/esm/icons/folder.mjs'
import FolderOpen from '@lucide/vue/dist/esm/icons/folder-open.mjs'
import FolderPlus from '@lucide/vue/dist/esm/icons/folder-plus.mjs'
import MoreHorizontal from '@lucide/vue/dist/esm/icons/ellipsis.mjs'
import Pencil from '@lucide/vue/dist/esm/icons/pencil.mjs'
import Trash2 from '@lucide/vue/dist/esm/icons/trash.mjs'
import ArrowUp from '@lucide/vue/dist/esm/icons/arrow-up.mjs'
import ArrowDown from '@lucide/vue/dist/esm/icons/arrow-down.mjs'
import CornerUpLeft from '@lucide/vue/dist/esm/icons/corner-up-left.mjs'
import FolderInput from '@lucide/vue/dist/esm/icons/folder-input.mjs'
import GripVertical from '@lucide/vue/dist/esm/icons/grip-vertical.mjs'
import type { TreeAction, TreeDropPosition, WorkspaceTreeNode } from '@/types/workspace'
import { useWorkspaceStore } from '@/stores/workspace'
import { dirname, displayName } from '@/utils/path'

const props = defineProps<{ node: WorkspaceTreeNode; depth: number; draggedPath: string }>()
const emit = defineEmits<{
  open: [path: string]
  action: [action: TreeAction, node: WorkspaceTreeNode]
  dragStart: [path: string]
  dragEnd: []
  move: [sourcePath: string, targetPath: string, position: Exclude<TreeDropPosition, 'root'>]
}>()
const store = useWorkspaceStore()
const menuOpen = ref(false)
const menuUp = ref(false)
const renaming = ref(false)
const renameValue = ref('')
const renameInput = ref<HTMLInputElement | null>(null)
const isExpanded = computed(() => store.expandedFolders.has(props.node.path))
const isActive = computed(() => store.activePath === props.node.path)
const isHarness = computed(() => store.isHarnessPath(props.node.path))
const isSpace = computed(() => Boolean(props.node.space))
const isWritable = computed(() => store.canWritePath(props.node.path))
const hasParent = computed(() => Boolean(dirname(props.node.path)))
const dropPosition = ref<Exclude<TreeDropPosition, 'root'> | null>(null)

function select(): void {
  menuOpen.value = false
  if (props.node.kind === 'folder') store.toggleFolder(props.node.path)
  else emit('open', props.node.path)
}

async function startRename(): Promise<void> {
  menuOpen.value = false
  renaming.value = true
  renameValue.value = props.node.name.replace(/\.md$/i, '')
  await nextTick()
  renameInput.value?.select()
}

function submitRename(): void {
  if (!renameValue.value.trim()) return
  renaming.value = false
  emit('action', 'rename', { ...props.node, name: renameValue.value.trim() })
}

function dispatch(action: Exclude<TreeAction, 'rename'>): void {
  menuOpen.value = false
  emit('action', action, props.node)
}

function toggleMenu(event: MouseEvent): void {
  const button = event.currentTarget as HTMLElement
  menuUp.value = button.getBoundingClientRect().bottom + 292 > window.innerHeight
  menuOpen.value = !menuOpen.value
}

function canDrop(position: Exclude<TreeDropPosition, 'root'>): boolean {
  const sourcePath = props.draggedPath
  if (!sourcePath || sourcePath === props.node.path) return false
  if (store.isHarnessPath(sourcePath) || isHarness.value) return false
  if (!store.canWritePath(sourcePath) || !isWritable.value) return false
  if (props.node.path.startsWith(`${sourcePath}/`)) return false
  return position !== 'inside' || props.node.kind === 'folder'
}

function handleDragStart(event: DragEvent): void {
  if (isHarness.value || isSpace.value || !isWritable.value || renaming.value) {
    event.preventDefault()
    return
  }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.node.path)
  }
  emit('dragStart', props.node.path)
}

function handleDragOver(event: DragEvent): void {
  if (!props.draggedPath) return
  const row = event.currentTarget as HTMLElement
  const rect = row.getBoundingClientRect()
  const ratio = (event.clientY - rect.top) / rect.height
  const nextPosition: Exclude<TreeDropPosition, 'root'> = props.node.kind === 'folder'
    ? ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside'
    : ratio < 0.5 ? 'before' : 'after'
  if (!canDrop(nextPosition)) {
    dropPosition.value = null
    return
  }
  event.preventDefault()
  event.stopPropagation()
  dropPosition.value = nextPosition
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function handleDragLeave(event: DragEvent): void {
  const row = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget
  if (relatedTarget instanceof Node && row.contains(relatedTarget)) return
  dropPosition.value = null
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  event.stopPropagation()
  const position = dropPosition.value
  dropPosition.value = null
  if (position && props.draggedPath && canDrop(position)) emit('move', props.draggedPath, props.node.path, position)
}
</script>

<template>
  <div class="tree-branch">
    <div
      class="tree-row"
      :class="{
        active: isActive,
        folder: node.kind === 'folder',
        space: isSpace,
        'is-dragging': draggedPath === node.path,
        'drop-before': dropPosition === 'before',
        'drop-inside': dropPosition === 'inside',
        'drop-after': dropPosition === 'after',
      }"
      :style="{ '--tree-depth': depth }"
      :title="node.path"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <span
        v-if="!isHarness && !isSpace && isWritable"
        class="tree-drag-handle"
        draggable="true"
        title="拖拽移动"
        aria-hidden="true"
        @dragstart.stop="handleDragStart"
        @dragend.stop="emit('dragEnd')"
      ><GripVertical :size="12" /></span>
      <button class="tree-main" type="button" @click="select">
        <ChevronRight v-if="node.kind === 'folder'" class="tree-chevron" :class="{ expanded: isExpanded }" :size="13" />
        <span v-else class="tree-spacer" />
        <FolderOpen v-if="node.kind === 'folder' && isExpanded" class="tree-icon folder-icon" :size="15" />
        <Folder v-else-if="node.kind === 'folder'" class="tree-icon folder-icon" :size="15" />
        <File v-else class="tree-icon file-icon" :size="14" />
        <input
          v-if="renaming"
          ref="renameInput"
          v-model="renameValue"
          class="tree-rename"
          aria-label="重命名项目"
          @click.stop
          @keydown.enter.stop="submitRename"
          @keydown.esc.stop="renaming = false"
          @blur="submitRename"
        />
        <span v-else class="tree-label">{{ node.space?.name ?? displayName(node.name) }}</span>
      </button>
      <div class="tree-menu-wrap">
        <button class="tree-more" type="button" :aria-label="`${node.name} 的操作`" @click.stop="toggleMenu">
          <MoreHorizontal :size="15" />
        </button>
        <Transition name="dropdown">
          <div v-if="menuOpen" class="dropdown tree-dropdown" :class="{ 'open-up': menuUp }" @mouseleave="menuOpen = false">
            <template v-if="node.kind === 'folder'">
              <button type="button" :disabled="!isWritable" @click="dispatch('new-document')"><FilePlus2 :size="14" />新建文档</button>
              <button type="button" :disabled="!isWritable" @click="dispatch('new-folder')"><FolderPlus :size="14" />新建文件夹</button>
              <div v-if="!isSpace" class="dropdown-separator" />
            </template>
            <template v-if="!isHarness && !isSpace">
              <button type="button" :disabled="!isWritable" @click="dispatch('move-up')"><ArrowUp :size="14" />上移</button>
              <button type="button" :disabled="!isWritable" @click="dispatch('move-down')"><ArrowDown :size="14" />下移</button>
              <button type="button" :disabled="!isWritable" @click="dispatch('move-to-folder')"><FolderInput :size="14" />移动到文件夹…</button>
              <button v-if="hasParent" type="button" :disabled="!isWritable" @click="dispatch('move-parent')"><CornerUpLeft :size="14" />移到上一级</button>
              <div class="dropdown-separator" />
            </template>
            <button v-if="!isSpace" type="button" :disabled="!isWritable" @click="startRename"><Pencil :size="14" />重命名</button>
            <template v-if="node.kind === 'file'">
              <button type="button" :disabled="!isWritable" @click="dispatch('duplicate')"><Copy :size="14" />创建副本</button>
              <button type="button" @click="dispatch('copy-path')"><Clipboard :size="14" />复制路径</button>
            </template>
            <button v-if="!isSpace" class="danger" type="button" :disabled="!isWritable" @click="dispatch('delete')"><Trash2 :size="14" />删除</button>
          </div>
        </Transition>
      </div>
    </div>
    <Transition name="folder-expand">
      <div v-if="node.kind === 'folder' && isExpanded" class="tree-children">
        <TreeNode
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          :depth="depth + 1"
          :dragged-path="draggedPath"
          @open="emit('open', $event)"
          @action="(action, item) => emit('action', action, item)"
          @drag-start="emit('dragStart', $event)"
          @drag-end="emit('dragEnd')"
          @move="(source, target, position) => emit('move', source, target, position)"
        />
        <div v-if="node.children.length === 0" class="tree-empty" :style="{ '--tree-depth': depth + 1 }">空文件夹</div>
      </div>
    </Transition>
  </div>
</template>
