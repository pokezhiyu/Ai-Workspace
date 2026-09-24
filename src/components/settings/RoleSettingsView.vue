<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import LoaderCircle from '@lucide/vue/dist/esm/icons/loader-circle.mjs'
import UsersRound from '@lucide/vue/dist/esm/icons/users-round.mjs'
import { useWorkspaceStore } from '@/stores/workspace'
import { useToast } from '@/composables/useToast'

const store = useWorkspaceStore()
const { toast } = useToast()
const draftRoleIds = ref<string[]>([])
const saving = ref(false)

const roles = computed(() => {
  const spaceOrder = new Map(store.spaces.map((space) => [space.id, space.order]))
  return store.roles
    .filter((role) => role.status === 'active')
    .sort((a, b) => (spaceOrder.get(a.spaceId) ?? Number.MAX_SAFE_INTEGER) - (spaceOrder.get(b.spaceId) ?? Number.MAX_SAFE_INTEGER))
})
const selectedIds = computed(() => new Set(draftRoleIds.value))
const allSelected = computed(() => roles.value.length > 0 && roles.value.every((role) => selectedIds.value.has(role.id)))
const changed = computed(() => {
  const current = [...store.activeRoleIds].sort()
  const draft = [...draftRoleIds.value].sort()
  return current.length !== draft.length || current.some((id, index) => id !== draft[index])
})
const writableSpaceNames = computed(() => {
  const spaceIds = new Set(roles.value.filter((role) => selectedIds.value.has(role.id)).map((role) => role.spaceId))
  return store.spaces.filter((space) => spaceIds.has(space.id)).map((space) => space.name)
})

watch(() => store.activeRoleIds, (ids) => {
  if (!changed.value || draftRoleIds.value.length === 0) draftRoleIds.value = [...ids]
}, { immediate: true })

function spaceName(spaceId: string): string {
  return store.spaces.find((space) => space.id === spaceId)?.name ?? spaceId
}

function toggleRole(roleId: string): void {
  const next = new Set(draftRoleIds.value)
  if (next.has(roleId)) next.delete(roleId)
  else next.add(roleId)
  draftRoleIds.value = roles.value.filter((role) => next.has(role.id)).map((role) => role.id)
}

function selectAll(): void {
  draftRoleIds.value = roles.value.map((role) => role.id)
}

async function saveRoles(): Promise<void> {
  saving.value = true
  try {
    await store.setActiveRoles(draftRoleIds.value)
    toast({ title: '我的角色已更新', description: writableSpaceNames.value.length ? `当前可编辑：${writableSpaceNames.value.join('、')}` : '当前专业空间均为只读。' })
  } catch (error) {
    toast({ title: '角色保存失败', description: error instanceof Error ? error.message : '请稍后重试', tone: 'danger' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header">
        <span class="eyebrow">工作身份</span>
        <h1>角色配置</h1>
        <p>选择你在当前项目中负责的工作。你可以同时承担多个角色，Agent 会根据你的角色协助完成对应工作。</p>
      </header>

      <section class="settings-section" aria-labelledby="my-roles-title">
        <div class="settings-section-heading role-selection-heading">
          <div>
            <h2 id="my-roles-title">我的角色</h2>
            <p>选择的角色对应专业空间可编辑，其他项目知识仍然可以查看和搜索。</p>
          </div>
          <button class="button role-select-all" type="button" :disabled="allSelected || saving" @click="selectAll">
            <Check :size="13" />{{ allSelected ? '已全部选择' : '全部选择' }}
          </button>
        </div>

        <div v-if="store.loading" class="settings-empty" aria-live="polite">
          <span class="settings-empty-icon"><LoaderCircle class="spin" :size="18" /></span>
          <strong>正在读取角色配置</strong>
          <span>正在加载 Workspace 工作身份。</span>
        </div>

        <div v-else-if="roles.length === 0" class="settings-empty">
          <span class="settings-empty-icon"><UsersRound :size="18" /></span>
          <strong>暂未发现可用角色</strong>
          <span>带有 <code>type: role</code> 和 <code>spaceId</code> 的角色文档会自动显示在这里。</span>
        </div>

        <ul v-else class="role-list role-selection-list">
          <li v-for="role in roles" :key="role.id" class="role-list-item role-selection-item" :class="{ selected: selectedIds.has(role.id) }">
            <label class="role-checkbox">
              <input type="checkbox" :checked="selectedIds.has(role.id)" :disabled="saving" @change="toggleRole(role.id)" />
              <span aria-hidden="true"><Check :size="12" /></span>
            </label>
            <div class="role-item-content">
              <div class="role-name-line">
                <h3>{{ role.name }}</h3>
                <span class="role-space-label">{{ spaceName(role.spaceId) }}</span>
                <span class="role-selection-state">{{ selectedIds.has(role.id) ? '已选择' : '未选择' }}</span>
              </div>
              <p>{{ role.description }}</p>
            </div>
          </li>
        </ul>

        <div class="role-access-summary" :class="{ empty: writableSpaceNames.length === 0 }">
          <div>
            <strong>{{ allSelected ? '你当前负责全部专业工作，适合个人项目。' : '当前可编辑' }}</strong>
            <span>{{ writableSpaceNames.length ? writableSpaceNames.join('、') : '暂未选择角色，所有专业空间均为只读。' }}</span>
          </div>
          <button class="button primary" type="button" :disabled="!changed || saving" @click="saveRoles">
            <LoaderCircle v-if="saving" class="spin" :size="13" />
            <Check v-else :size="13" />
            {{ saving ? '正在保存…' : '保存角色' }}
          </button>
        </div>
      </section>

      <footer class="settings-source-footer">
        <div><strong>角色来源</strong><code>Role Markdown → Role Registry → Active Roles</code></div>
        <span>Workspace 全局可读，职责空间可写</span>
      </footer>
    </div>
  </section>
</template>
