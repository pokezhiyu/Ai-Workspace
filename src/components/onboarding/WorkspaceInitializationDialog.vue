<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import ArrowLeft from '@lucide/vue/dist/esm/icons/arrow-left.mjs'
import ArrowRight from '@lucide/vue/dist/esm/icons/arrow-right.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useToast } from '@/composables/useToast'
import { createWorkspaceId } from '@/features/workspace/workspaceManifest'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ initialized: [homePath: string] }>()
const store = useWorkspaceStore()
const { toast } = useToast()
const nameInput = ref<HTMLInputElement | null>(null)
const firstRoleInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)
const errorMessage = ref('')
const draft = reactive({ name: '', description: '', language: 'zh-CN' })
const step = ref<'identity' | 'roles'>('identity')
const selectedRoleIds = ref<string[]>([])

const generatedId = computed(() => createWorkspaceId(draft.name))
const dialogTitle = computed(() => step.value === 'identity' ? '完善项目信息' : '选择工作角色')
const dialogDescription = computed(() => step.value === 'identity'
  ? '首次使用前，请先确认当前项目的基本信息。'
  : '选择你当前负责的工作，系统会启用对应专业空间的编辑权限。')
const availableRoles = computed(() => store.roles.filter((role) => role.status === 'active'))

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    const identity = store.workspaceManifest.workspace
    Object.assign(draft, {
      name: identity.name,
      description: identity.description,
      language: identity.language || 'zh-CN',
    })
    step.value = 'identity'
    selectedRoleIds.value = []
    errorMessage.value = ''
    await nextTick()
    nameInput.value?.focus()
  },
  { immediate: true },
)

function validateIdentity(): boolean {
  errorMessage.value = ''
  const name = draft.name.trim()
  const description = draft.description.trim()
  if (!name) {
    errorMessage.value = '请填写项目名称。'
    nameInput.value?.focus()
    return false
  }
  if (!description) {
    errorMessage.value = '请填写项目介绍。'
    return false
  }
  return true
}

async function continueToRoles(): Promise<void> {
  if (!validateIdentity()) return
  step.value = 'roles'
  errorMessage.value = ''
  await nextTick()
  firstRoleInput.value?.focus()
}

function toggleRole(roleId: string): void {
  const next = new Set(selectedRoleIds.value)
  if (next.has(roleId)) next.delete(roleId)
  else next.add(roleId)
  selectedRoleIds.value = availableRoles.value.filter((role) => next.has(role.id)).map((role) => role.id)
}

function spaceName(spaceId: string): string {
  return store.spaces.find((space) => space.id === spaceId)?.name ?? spaceId
}

function captureFirstRoleInput(element: unknown, index: number): void {
  if (index === 0 && element instanceof HTMLInputElement) firstRoleInput.value = element
}

async function completeInitialization(roleIds: string[]): Promise<void> {
  if (!validateIdentity()) {
    step.value = 'identity'
    await nextTick()
    nameInput.value?.focus()
    return
  }

  submitting.value = true
  try {
    const homePath = await store.completeWorkspaceInitialization({
      name: draft.name.trim(),
      description: draft.description.trim(),
      language: draft.language,
    }, roleIds)
    toast({
      title: 'Workspace 已创建',
      description: roleIds.length ? `已启用 ${roleIds.length} 个工作角色。` : '暂未选择角色，可稍后在设置中配置。',
    })
    emit('initialized', homePath)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '项目信息保存失败，请重试。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseDialog
    :open="open"
    :title="dialogTitle"
    :description="dialogDescription"
    width="md"
    :dismissible="false"
  >
    <div class="onboarding-step-indicator" aria-live="polite">
      <span :class="{ active: step === 'identity' }">1 项目信息</span>
      <span :class="{ active: step === 'roles' }">2 工作角色</span>
    </div>

    <form v-if="step === 'identity'" class="dialog-form workspace-initialization-form" @submit.prevent="continueToRoles">
        <label class="manifest-field">
          <span>项目名称</span>
          <input
            ref="nameInput"
            v-model="draft.name"
            name="initial-project-name"
            autocomplete="organization"
            maxlength="80"
            placeholder="例如：客户服务平台"
          />
        </label>

        <label class="manifest-field">
          <span>项目介绍</span>
          <textarea
            v-model="draft.description"
            name="initial-project-description"
            rows="3"
            maxlength="280"
            placeholder="简要说明项目解决的问题和主要目标"
          />
          <small>{{ draft.description.length }} / 280</small>
        </label>

        <label class="manifest-field">
          <span>默认语言</span>
          <select v-model="draft.language" name="initial-project-language">
            <option value="zh-CN">简体中文（zh-CN）</option>
            <option value="en-US">English（en-US）</option>
          </select>
        </label>

        <div class="workspace-id-preview" aria-live="polite">
          <span>Workspace ID</span>
          <code>{{ generatedId || '输入项目名称后自动生成' }}</code>
          <small>根据项目名称生成。保存后将作为稳定标识固定，不可修改。</small>
        </div>

        <p v-if="errorMessage" class="manifest-form-error" role="alert">{{ errorMessage }}</p>

        <div class="dialog-actions">
          <button class="button primary" type="submit">
            下一步 <ArrowRight :size="13" />
          </button>
        </div>
    </form>

    <div v-else class="workspace-role-onboarding">
      <div v-if="availableRoles.length" class="onboarding-role-list" role="group" aria-label="工作角色">
        <label
          v-for="(role, index) in availableRoles"
          :key="role.id"
          class="onboarding-role-option"
          :class="{ selected: selectedRoleIds.includes(role.id) }"
        >
          <input
            :ref="(element) => captureFirstRoleInput(element, index)"
            type="checkbox"
            :checked="selectedRoleIds.includes(role.id)"
            :disabled="submitting"
            @change="toggleRole(role.id)"
          />
          <span class="onboarding-role-check" aria-hidden="true"><Check :size="12" /></span>
          <span class="onboarding-role-copy">
            <span><strong>{{ role.name }}</strong><small>{{ spaceName(role.spaceId) }}</small></span>
            <em>{{ role.description }}</em>
          </span>
        </label>
      </div>
      <p v-else class="onboarding-role-empty">暂未发现可用角色。你可以先进入 Workspace，稍后在设置中配置。</p>

      <p class="onboarding-extension-note">
        后续需要新增角色或专业空间时，可以让 Agent 在当前 Workspace 的 Role / Space 规则基础上继续添加。
      </p>

      <p v-if="errorMessage" class="manifest-form-error" role="alert">{{ errorMessage }}</p>

      <div class="dialog-actions onboarding-role-actions">
        <button class="button subtle" type="button" :disabled="submitting" @click="step = 'identity'">
          <ArrowLeft :size="13" />上一步
        </button>
        <button class="button subtle" type="button" :disabled="submitting" @click="completeInitialization([])">
          跳过，稍后设置
        </button>
        <button
          class="button primary"
          type="button"
          :disabled="submitting || selectedRoleIds.length === 0"
          @click="completeInitialization(selectedRoleIds)"
        >
          {{ submitting ? '保存中…' : '保存并进入 Workspace' }}
        </button>
      </div>
    </div>
  </BaseDialog>
</template>
