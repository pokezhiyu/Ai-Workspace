<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FileQuestion from '@lucide/vue/dist/esm/icons/file-question-mark.mjs'
import LoaderCircle from '@lucide/vue/dist/esm/icons/loader-circle.mjs'
import DocumentHeader from './DocumentHeader.vue'
import DocumentLocation from './DocumentLocation.vue'
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ navigate: [path: string] }>()
const store = useWorkspaceStore()
const { toast } = useToast()
const mode = ref<'read' | 'edit'>('read')
const writable = computed(() => Boolean(store.activePath) && store.canWritePath(store.activePath))

watch(() => store.activePath, () => { mode.value = 'read' })

function changeMode(next: 'read' | 'edit'): void {
  if (next === 'edit' && !writable.value) {
    toast({ title: '当前文档为只读', description: '当前角色没有此空间的编辑权限，但仍可查看和引用内容。' })
    return
  }
  if (next === 'read' && store.hasUnsavedChanges && !window.confirm('放弃未保存的修改并返回阅读模式？')) return
  if (next === 'read' && store.activeDocument) store.setEditorSource(store.activeDocument.source)
  mode.value = next
}

async function save(): Promise<void> {
  try {
    await store.saveDocument()
  } catch (error) {
    toast({
      title: '文档保存失败',
      description: error instanceof Error ? error.message.split('\n')[0] : '请检查 Frontmatter 后重试',
      tone: 'danger',
    })
  }
}
</script>

<template>
  <main class="document-view">
    <div v-if="store.loading" class="document-state"><LoaderCircle class="spin" :size="20" />正在打开 Workspace…</div>
    <div v-else-if="!store.activeDocument" class="document-state"><FileQuestion :size="22" />请选择 Markdown 文档</div>
    <Transition v-else name="document-switch" mode="out-in">
      <article :key="store.activePath" class="document-page">
        <DocumentLocation :path="store.activePath" />
        <DocumentHeader :document="store.activeDocument" :mode="mode" :save-state="store.saveState" :writable="writable" @mode="changeMode" @save="save" />
        <div v-if="store.saveState === 'unsaved'" class="unsaved-indicator">未保存</div>
        <MarkdownEditor
          v-if="mode === 'edit'"
          :model-value="store.editorSource"
          @update:model-value="store.setEditorSource"
          @save="save"
        />
        <div v-else class="document-content">
          <MarkdownRenderer
            :content="store.activeDocument.body"
            :path="store.activePath"
            @navigate="emit('navigate', $event)"
            @active-heading="store.activeHeadingId = $event"
          />
        </div>
      </article>
    </Transition>
  </main>
</template>
