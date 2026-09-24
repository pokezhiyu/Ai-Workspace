<script setup lang="ts">
import { ref } from 'vue'
import type { TreeAction, TreeDropPosition, WorkspaceTreeNode } from '@/types/workspace'
import TreeNode from './TreeNode.vue'

defineProps<{ nodes: WorkspaceTreeNode[] }>()
const emit = defineEmits<{
  open: [path: string]
  action: [action: TreeAction, node: WorkspaceTreeNode]
  move: [sourcePath: string, targetPath: string | null, position: TreeDropPosition]
}>()
const draggedPath = ref('')

function handleRootDragOver(event: DragEvent): void {
  if (!draggedPath.value) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function handleRootDrop(event: DragEvent): void {
  event.preventDefault()
  if (draggedPath.value) emit('move', draggedPath.value, null, 'root')
  draggedPath.value = ''
}
</script>

<template>
  <nav class="knowledge-tree" aria-label="项目知识树">
    <TreeNode
      v-for="node in nodes"
      :key="node.path"
      :node="node"
      :depth="0"
      :dragged-path="draggedPath"
      @open="emit('open', $event)"
      @action="(action, item) => emit('action', action, item)"
      @drag-start="draggedPath = $event"
      @drag-end="draggedPath = ''"
      @move="(source, target, position) => { emit('move', source, target, position); draggedPath = '' }"
    />
    <div
      v-if="draggedPath"
      class="tree-root-drop-zone"
      role="status"
      @dragover="handleRootDragOver"
      @drop="handleRootDrop"
    >
      移到 Workspace 根目录
    </div>
  </nav>
</template>
