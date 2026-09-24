<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

const MIN_WIDTH = 220
const MAX_WIDTH = 360
const DEFAULT_WIDTH = 264
const KEYBOARD_STEP = 16

const props = defineProps<{ value: number }>()
const emit = defineEmits<{
  resize: [width: number]
  'resize-end': [width: number]
}>()

let startX = 0
let startWidth = DEFAULT_WIDTH
let latestWidth = DEFAULT_WIDTH
let activePointerId: number | null = null

function clampWidth(width: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width)))
}

function stopResize(): void {
  if (activePointerId === null) return
  activePointerId = null
  document.body.classList.remove('is-resizing-sidebar')
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerUp)
}

function handlePointerMove(event: PointerEvent): void {
  if (event.pointerId !== activePointerId) return
  latestWidth = clampWidth(startWidth + event.clientX - startX)
  emit('resize', latestWidth)
}

function handlePointerUp(event: PointerEvent): void {
  if (event.pointerId !== activePointerId) return
  emit('resize-end', latestWidth)
  stopResize()
}

function handlePointerDown(event: PointerEvent): void {
  if (event.button !== 0 || window.innerWidth <= 1080) return
  event.preventDefault()
  startX = event.clientX
  startWidth = props.value
  latestWidth = props.value
  activePointerId = event.pointerId
  document.body.classList.add('is-resizing-sidebar')
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointercancel', handlePointerUp)
}

function setWidth(width: number): void {
  const nextWidth = clampWidth(width)
  emit('resize', nextWidth)
  emit('resize-end', nextWidth)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    setWidth(props.value - KEYBOARD_STEP)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    setWidth(props.value + KEYBOARD_STEP)
  } else if (event.key === 'Home') {
    event.preventDefault()
    setWidth(MIN_WIDTH)
  } else if (event.key === 'End') {
    event.preventDefault()
    setWidth(MAX_WIDTH)
  }
}

onBeforeUnmount(stopResize)
</script>

<template>
  <button
    class="sidebar-resize-handle"
    type="button"
    role="separator"
    aria-label="调整知识侧栏宽度"
    aria-orientation="vertical"
    :aria-valuemin="MIN_WIDTH"
    :aria-valuemax="MAX_WIDTH"
    :aria-valuenow="value"
    title="拖拽调整宽度，双击恢复默认宽度"
    @pointerdown="handlePointerDown"
    @keydown="handleKeydown"
    @dblclick="setWidth(DEFAULT_WIDTH)"
  />
</template>
