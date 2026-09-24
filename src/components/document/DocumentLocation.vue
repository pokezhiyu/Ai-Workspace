<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import ChevronRight from '@lucide/vue/dist/esm/icons/chevron-right.mjs'
import Copy from '@lucide/vue/dist/esm/icons/copy.mjs'
import FolderTree from '@lucide/vue/dist/esm/icons/folder-tree.mjs'
import { useToast } from '@/composables/useToast'

const props = defineProps<{ path: string }>()
const segments = computed(() => props.path.split('/').filter(Boolean))
const copied = ref(false)
const { toast } = useToast()
let resetTimer: number | undefined

async function copyPath(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.path)
    copied.value = true
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => { copied.value = false }, 1600)
    toast({ title: '文档路径已复制', description: props.path })
  } catch {
    toast({ title: '无法复制文档路径', description: '请手动选择路径后复制', tone: 'danger' })
  }
}

onBeforeUnmount(() => window.clearTimeout(resetTimer))
</script>

<template>
  <nav class="document-location" aria-label="当前文档位置" :title="path">
    <div class="document-location-trail">
      <FolderTree :size="13" aria-hidden="true" />
      <span class="document-location-root">Workspace</span>
      <template v-for="(segment, index) in segments" :key="`${segment}-${index}`">
        <ChevronRight :size="11" aria-hidden="true" />
        <span :aria-current="index === segments.length - 1 ? 'page' : undefined">{{ segment }}</span>
      </template>
    </div>
    <button type="button" :aria-label="copied ? '文档路径已复制' : '复制文档路径'" @click="copyPath">
      <Check v-if="copied" :size="12" />
      <Copy v-else :size="12" />
      <span>{{ copied ? '已复制' : '复制路径' }}</span>
    </button>
  </nav>
</template>
