<script setup lang="ts">
import { computed, ref } from 'vue'
import Blocks from '@lucide/vue/dist/esm/icons/blocks.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import ChevronDown from '@lucide/vue/dist/esm/icons/chevron-down.mjs'
import CircleAlert from '@lucide/vue/dist/esm/icons/circle-alert.mjs'
import CircleCheck from '@lucide/vue/dist/esm/icons/circle-check.mjs'
import CircleMinus from '@lucide/vue/dist/esm/icons/circle-minus.mjs'
import ExternalLink from '@lucide/vue/dist/esm/icons/external-link.mjs'
import Power from '@lucide/vue/dist/esm/icons/power.mjs'
import RefreshCw from '@lucide/vue/dist/esm/icons/refresh-cw.mjs'
import Trash2 from '@lucide/vue/dist/esm/icons/trash.mjs'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { useToast } from '@/composables/useToast'
import { useWorkspaceStore } from '@/stores/workspace'
import { parseWorkspaceSkillRegistry, WORKSPACE_SKILL_REGISTRY_PATH } from '@/features/skills/workspaceSkillRegistry'
import type { WorkspaceSkill, WorkspaceSkillImportCandidate, WorkspaceSkillRegistry, WorkspaceSkillStatus } from '@/types/skills'

const store = useWorkspaceStore()
const { toast } = useToast()
const scanning = ref(false)
const pendingId = ref('')
const expandedId = ref('')
const deleteTarget = ref<WorkspaceSkill | null>(null)

const registryState = computed<{ data: WorkspaceSkillRegistry | null; error: string | null }>(() => {
  const entry = store.entries.find((candidate) => candidate.path === WORKSPACE_SKILL_REGISTRY_PATH)
  if (!entry?.content) return { data: null, error: store.loading ? null : '未找到 Workspace Skill Registry。' }
  try {
    return { data: parseWorkspaceSkillRegistry(entry.content), error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Skill Registry 读取失败。' }
  }
})

const skills = computed(() => registryState.value.data?.skills ?? [])
const enabledCount = computed(() => skills.value.filter((skill) => skill.status === 'enabled').length)
const generatedAt = computed(() => {
  const value = registryState.value.data?.generatedAt
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
})

const statusLabels: Record<WorkspaceSkillStatus, string> = {
  enabled: '已启用',
  disabled: '已禁用',
  invalid: '配置异常',
}

function isWebSource(value: string | null): boolean {
  return Boolean(value && /^https?:\/\//i.test(value))
}

function scopeLabel(skill: WorkspaceSkill): string {
  if (skill.scope === 'workspace') return 'Workspace 本地'
  return '待迁移的旧索引'
}

function candidateOriginLabel(candidate: WorkspaceSkillImportCandidate): string {
  return candidate.origin === 'claude-global' ? 'Claude 全局目录' : 'Codex 全局目录'
}

async function rescan(): Promise<void> {
  if (scanning.value) return
  scanning.value = true
  try {
    await store.rescanSkills()
    toast({
      title: 'Skill 扫描完成',
      description: `发现 ${store.skillRegistry?.skills.length ?? 0} 个项目 Skill、${store.externalSkillCandidates.length} 个可导入 Skill，禁用状态已保留。`,
    })
  } catch (error) {
    toast({ title: '重新扫描失败', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  } finally {
    scanning.value = false
  }
}

async function importCandidate(candidate: WorkspaceSkillImportCandidate): Promise<void> {
  if (pendingId.value) return
  pendingId.value = candidate.id
  try {
    await store.importSkill(candidate.id)
    toast({ title: 'Skill 已导入 Workspace', description: `${candidate.name} 现在会随项目一起进入 Git。` })
  } catch (error) {
    toast({ title: 'Skill 导入失败', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  } finally {
    pendingId.value = ''
  }
}

async function toggleSkill(skill: WorkspaceSkill): Promise<void> {
  if (pendingId.value || skill.status === 'invalid') return
  pendingId.value = skill.id
  const nextEnabled = skill.status !== 'enabled'
  try {
    await store.setSkillEnabled(skill.id, nextEnabled)
    toast({ title: nextEnabled ? 'Skill 已启用' : 'Skill 已禁用', description: skill.name })
  } catch (error) {
    toast({ title: '状态更新失败', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  } finally {
    pendingId.value = ''
  }
}

async function confirmDelete(): Promise<void> {
  const skill = deleteTarget.value
  if (!skill || pendingId.value) return
  pendingId.value = skill.id
  try {
    const result = await store.deleteSkill(skill.id)
    deleteTarget.value = null
    if (expandedId.value === skill.id) expandedId.value = ''
    toast({
      title: result.removedFiles ? 'Workspace Skill 已删除' : 'Skill 已解除注册',
      description: result.removedFiles ? `${skill.name} 的本地文件已删除。` : '共享文件保持不变，重新扫描也不会自动恢复该引用。',
    })
  } catch (error) {
    toast({ title: '删除失败', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  } finally {
    pendingId.value = ''
  }
}
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header skill-page-header">
        <div>
          <span class="eyebrow">Workspace capabilities</span>
          <h1>Skill 配置</h1>
          <p>统一查看和管理随项目保存的 Agent 能力。项目内 Skill 目录与 SKILL.md 始终是事实来源。</p>
        </div>
        <button class="button" type="button" :disabled="scanning" @click="rescan">
          <RefreshCw :size="13" :class="{ 'is-spinning': scanning }" />
          {{ scanning ? '扫描中…' : '重新扫描' }}
        </button>
      </header>

      <section class="settings-section" aria-labelledby="installed-skills-title">
        <div class="settings-section-heading">
          <div>
            <h2 id="installed-skills-title">当前 Skills</h2>
            <p>已启用 {{ enabledCount }} 个；这里只注册项目自带 Skill，配置异常的能力不会提供给 Agent。</p>
          </div>
          <span v-if="registryState.data" class="settings-count">{{ skills.length }}</span>
        </div>

        <div v-if="store.loading" class="skill-state" aria-live="polite">
          <span class="skill-state-icon"><Blocks :size="18" /></span>
          <strong>正在读取 Skill Registry</strong>
          <span>正在检查 Workspace 当前能力。</span>
        </div>

        <div v-else-if="registryState.error" class="skill-state error" role="alert">
          <span class="skill-state-icon"><CircleAlert :size="18" /></span>
          <strong>无法读取 Skill Registry</strong>
          <span>{{ registryState.error }}</span>
          <button class="button" type="button" :disabled="scanning" @click="rescan">重新建立 Registry</button>
        </div>

        <div v-else-if="skills.length === 0" class="skill-state">
          <span class="skill-state-icon"><Blocks :size="18" /></span>
          <strong>暂未发现 Skill</strong>
          <span>Agent 安装 Skill 后，在这里重新扫描即可加入当前 Workspace。</span>
        </div>

        <ul v-else class="skill-list">
          <li v-for="skill in skills" :key="skill.id" class="skill-list-item" :data-status="skill.status">
            <span class="skill-item-icon" aria-hidden="true"><Blocks :size="16" /></span>
            <div class="skill-item-content">
              <div class="skill-name-line">
                <h3>{{ skill.name }}</h3>
                <span class="skill-status" :data-status="skill.status">
                  <CircleCheck v-if="skill.status === 'enabled'" :size="12" />
                  <CircleMinus v-else-if="skill.status === 'disabled'" :size="12" />
                  <CircleAlert v-else :size="12" />
                  {{ statusLabels[skill.status] }}
                </span>
              </div>
              <p>{{ skill.purpose }}</p>
              <div v-if="skill.capabilities.length" class="skill-capabilities" aria-label="Capabilities">
                <span v-for="capability in skill.capabilities.slice(0, 6)" :key="capability">{{ capability }}</span>
                <span v-if="skill.capabilities.length > 6">+{{ skill.capabilities.length - 6 }}</span>
              </div>
              <p v-if="skill.status === 'invalid'" class="skill-health-error">
                <CircleAlert :size="12" />{{ skill.health.issues[0] || 'Skill 配置无法读取。' }}
              </p>

              <button class="skill-detail-toggle" type="button" :aria-expanded="expandedId === skill.id" @click="expandedId = expandedId === skill.id ? '' : skill.id">
                高级信息
                <ChevronDown :size="12" :class="{ expanded: expandedId === skill.id }" />
              </button>
              <div v-if="expandedId === skill.id" class="skill-details">
                <dl>
                  <div><dt>Skill ID</dt><dd><code>{{ skill.id }}</code></dd></div>
                  <div><dt>范围</dt><dd>{{ scopeLabel(skill) }}</dd></div>
                  <div><dt>版本</dt><dd>{{ skill.version || '未声明' }}</dd></div>
                  <div><dt>健康检查</dt><dd><Check v-if="skill.health.valid" :size="12" />{{ skill.health.valid ? '通过' : `${skill.health.issues.length} 项异常` }}</dd></div>
                  <div class="skill-detail-wide"><dt>位置</dt><dd><code>{{ skill.installPath }}</code></dd></div>
                  <div v-if="skill.source" class="skill-detail-wide">
                    <dt>来源</dt>
                    <dd>
                      <a v-if="isWebSource(skill.source)" :href="skill.source" target="_blank" rel="noopener noreferrer">{{ skill.source }}<ExternalLink :size="11" /></a>
                      <code v-else>{{ skill.source }}</code>
                    </dd>
                  </div>
                </dl>
                <ul v-if="skill.health.issues.length" class="skill-health-list">
                  <li v-for="issue in skill.health.issues" :key="issue">{{ issue }}</li>
                </ul>
              </div>
            </div>
            <div class="skill-row-actions">
              <button class="button subtle" type="button" :disabled="Boolean(pendingId) || skill.status === 'invalid'" @click="toggleSkill(skill)">
                <Power :size="12" />{{ skill.status === 'enabled' ? '禁用' : '启用' }}
              </button>
              <button class="button subtle danger-text" type="button" :disabled="Boolean(pendingId)" @click="deleteTarget = skill">
                <Trash2 :size="12" />删除
              </button>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="store.externalSkillCandidates.length" class="settings-section" aria-labelledby="importable-skills-title">
        <div class="settings-section-heading">
          <div>
            <h2 id="importable-skills-title">可导入 Skills</h2>
            <p>这些能力只存在于当前 Agent 的全局环境；导入项目后才会成为 Workspace 正式能力。</p>
          </div>
          <span class="settings-count">{{ store.externalSkillCandidates.length }}</span>
        </div>
        <ul class="skill-import-list">
          <li v-for="candidate in store.externalSkillCandidates" :key="candidate.id">
            <span class="skill-item-icon" aria-hidden="true"><Blocks :size="16" /></span>
            <div>
              <div class="skill-name-line"><h3>{{ candidate.name }}</h3><span class="skill-import-origin">{{ candidateOriginLabel(candidate) }}</span></div>
              <p>{{ candidate.purpose }}</p>
              <div v-if="candidate.capabilities.length" class="skill-capabilities">
                <span v-for="capability in candidate.capabilities.slice(0, 5)" :key="capability">{{ capability }}</span>
              </div>
            </div>
            <button class="button" type="button" :disabled="Boolean(pendingId)" @click="importCandidate(candidate)">
              {{ pendingId === candidate.id ? '导入中…' : '导入到 Workspace' }}
            </button>
          </li>
        </ul>
      </section>

      <footer v-if="registryState.data" class="skill-registry-footer">
        <div><strong>Workspace Skill Registry</strong><code>{{ WORKSPACE_SKILL_REGISTRY_PATH }}</code></div>
        <div class="skill-registry-meta">
          <span v-if="generatedAt">检查于 {{ generatedAt }}</span>
          <span>正式 Skill 位于 .workspace/skills/installed</span>
        </div>
      </footer>
    </div>

    <BaseDialog
      :open="Boolean(deleteTarget)"
      title="删除 Skill"
      description="此操作只会删除 Workspace 项目内的 Skill 文件，不会修改 Codex、Claude 或系统全局目录。"
      width="sm"
      @close="deleteTarget = null"
    >
      <div class="skill-delete-dialog">
        <div v-if="deleteTarget" class="skill-delete-target">
          <span><Blocks :size="16" /></span>
          <div><strong>{{ deleteTarget.name }}</strong><code>{{ deleteTarget.installPath }}</code></div>
        </div>
        <p>确认从当前 Workspace 移除该能力？</p>
        <div class="dialog-actions">
          <button class="button" type="button" @click="deleteTarget = null">取消</button>
          <button class="button danger" type="button" :disabled="Boolean(pendingId)" @click="confirmDelete">
            {{ pendingId ? '处理中…' : '确认删除文件' }}
          </button>
        </div>
      </div>
    </BaseDialog>
  </section>
</template>
