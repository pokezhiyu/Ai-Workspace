<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import FileCog from '@lucide/vue/dist/esm/icons/file-cog.mjs'
import Save from '@lucide/vue/dist/esm/icons/save.mjs'
import { useWorkspaceStore } from '@/stores/workspace'
import { useToast } from '@/composables/useToast'
import { WORKSPACE_MANIFEST_PATH } from '@/features/workspace/workspaceManifest'

const store = useWorkspaceStore()
const { toast } = useToast()
const draft = reactive({ id: '', name: '', description: '', language: 'zh-CN' })
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const errorMessage = ref('')

watch(
  () => store.workspaceManifest.workspace,
  (identity) => Object.assign(draft, identity),
  { immediate: true },
)

const isDirty = computed(() => {
  const current = store.workspaceManifest.workspace
  return draft.name.trim() !== current.name
    || draft.description.trim() !== current.description
    || draft.language !== current.language
})

async function saveManifest(): Promise<void> {
  errorMessage.value = ''
  const id = store.workspaceManifest.workspace.id
  const name = draft.name.trim()
  const description = draft.description.trim()
  if (!name) {
    errorMessage.value = '项目名称不能为空。'
    return
  }
  if (!description) {
    errorMessage.value = '项目介绍不能为空。'
    return
  }
  saveState.value = 'saving'
  try {
    await store.updateWorkspaceIdentity({ id, name, description, language: draft.language })
    saveState.value = 'saved'
    toast({ title: 'Workspace 配置已保存', description: '项目身份与左上角名称已同步更新。' })
    window.setTimeout(() => {
      if (saveState.value === 'saved') saveState.value = 'idle'
    }, 1800)
  } catch (error) {
    saveState.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Workspace Manifest 保存失败。'
  }
}
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header">
        <span class="eyebrow">Workspace identity</span>
        <h1>Workspace 配置</h1>
        <p>管理当前项目的基础身份。配置直接写入 <code>{{ WORKSPACE_MANIFEST_PATH }}</code>，同时供界面与 Agent 读取。</p>
      </header>

      <form class="workspace-manifest-form" @submit.prevent="saveManifest">
        <section class="settings-section" aria-labelledby="workspace-identity-title">
          <div class="settings-section-heading">
            <div>
              <h2 id="workspace-identity-title">项目身份</h2>
              <p>项目名称保存后会立即同步到 Workspace 左上角。</p>
            </div>
          </div>

          <div class="manifest-fields">
            <label class="manifest-field manifest-field-wide">
              <span>项目名称</span>
              <input v-model="draft.name" name="workspace-name" autocomplete="off" maxlength="80" />
            </label>
            <label class="manifest-field manifest-field-wide">
              <span>项目介绍</span>
              <textarea v-model="draft.description" name="workspace-description" rows="3" maxlength="280" />
              <small>{{ draft.description.length }} / 280</small>
            </label>
            <label class="manifest-field">
              <span>Workspace ID</span>
              <input :value="draft.id" name="workspace-id" readonly aria-readonly="true" spellcheck="false" />
              <small>项目初始化时根据名称生成，保存后固定且不可修改。</small>
            </label>
            <label class="manifest-field">
              <span>默认语言</span>
              <select v-model="draft.language" name="workspace-language">
                <option value="zh-CN">简体中文（zh-CN）</option>
                <option value="en-US">English（en-US）</option>
              </select>
            </label>
            <label class="manifest-field">
              <span>Schema Version</span>
              <input :value="store.workspaceManifest.schemaVersion" readonly aria-readonly="true" />
              <small>由 Workspace 维护，不随项目内容版本变化。</small>
            </label>
          </div>
          <p v-if="errorMessage" class="manifest-form-error" role="alert">{{ errorMessage }}</p>
        </section>

        <footer class="manifest-save-bar">
          <div>
            <FileCog :size="15" />
            <span><strong>Workspace Manifest</strong><code>{{ WORKSPACE_MANIFEST_PATH }}</code></span>
          </div>
          <button class="button primary" type="submit" :disabled="saveState === 'saving' || !isDirty">
            <Save :size="13" />
            {{ saveState === 'saving' ? '保存中…' : saveState === 'saved' ? '已保存' : '保存配置' }}
          </button>
        </footer>
      </form>
    </div>
  </section>
</template>
