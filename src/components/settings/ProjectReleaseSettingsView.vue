<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CalendarDays from '@lucide/vue/dist/esm/icons/calendar-days.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import Circle from '@lucide/vue/dist/esm/icons/circle.mjs'
import ExternalLink from '@lucide/vue/dist/esm/icons/external-link.mjs'
import Plus from '@lucide/vue/dist/esm/icons/plus.mjs'
import Rocket from '@lucide/vue/dist/esm/icons/rocket.mjs'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useToast } from '@/composables/useToast'
import type { ProjectRelease } from '@/types/releases'

const store = useWorkspaceStore()
const router = useRouter()
const { toast } = useToast()
const dialogOpen = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const draft = reactive({ id: '', name: '', goal: '', summary: '', startedAt: '', makeActive: false })

const releases = computed(() => store.releaseRegistry.releases)
const current = computed(() => store.currentRelease)

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function suggestedId(): string {
  const largest = releases.value.reduce((value, release) => {
    const match = /^v(\d+)$/i.exec(release.id)
    return Math.max(value, match ? Number(match[1]) : 0)
  }, 0)
  return `v${largest + 1}`
}

function openCreateDialog(): void {
  const id = suggestedId()
  Object.assign(draft, {
    id,
    name: `${id.toUpperCase()} 新版本`,
    goal: '',
    summary: '',
    startedAt: today(),
    makeActive: !current.value,
  })
  errorMessage.value = ''
  dialogOpen.value = true
}

async function createRelease(): Promise<void> {
  errorMessage.value = ''
  if (!/^[a-z0-9][a-z0-9-]{0,31}$/.test(draft.id)) {
    errorMessage.value = 'Release ID 仅支持小写字母、数字与连字符。'
    return
  }
  if (!draft.name.trim() || !draft.goal.trim() || !draft.summary.trim() || !draft.startedAt) {
    errorMessage.value = '请完整填写版本名称、目标、简介和开始时间。'
    return
  }
  submitting.value = true
  try {
    await store.createProjectRelease({
      id: draft.id,
      name: draft.name.trim(),
      goal: draft.goal.trim(),
      summary: draft.summary.trim(),
      startedAt: draft.startedAt,
      makeActive: draft.makeActive,
    })
    dialogOpen.value = false
    toast({ title: '项目版本已创建', description: draft.makeActive ? '已设为当前版本。' : '已加入规划队列。' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '项目版本创建失败。'
  } finally {
    submitting.value = false
  }
}

async function publishRelease(release: ProjectRelease): Promise<void> {
  if (!window.confirm(`确认将“${release.name}”标记为已发布？`)) return
  try {
    await store.publishProjectRelease(release.id, today())
    toast({ title: '项目版本已发布', description: '当前知识保持累计有效，可继续规划下一期。' })
  } catch (error) {
    toast({ title: '发布失败', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  }
}

async function activateRelease(release: ProjectRelease): Promise<void> {
  try {
    await store.activateProjectRelease(release.id)
    toast({ title: '当前版本已更新', description: `${release.name} 已进入进行中状态。` })
  } catch (error) {
    toast({ title: '无法激活版本', description: error instanceof Error ? error.message : '请稍后重试。', tone: 'danger' })
  }
}

function openSummary(release: ProjectRelease): void {
  void router.push({ name: 'document', params: { path: release.summaryPath.split('/') } })
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(date)
}
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header release-page-header">
        <div>
          <span class="eyebrow">Project evolution</span>
          <h1>项目版本</h1>
          <p>Release 描述项目阶段和里程碑；Workspace 文档始终是累计演进后的当前有效知识。</p>
        </div>
        <button class="button primary" type="button" @click="openCreateDialog"><Plus :size="14" />创建新版本</button>
      </header>

      <section v-if="current" class="settings-section release-current" aria-labelledby="current-release-title">
        <div class="release-current-mark"><Rocket :size="17" /></div>
        <div>
          <span class="release-kicker">当前版本 · 进行中</span>
          <h2 id="current-release-title">{{ current.name }}</h2>
          <p>{{ current.goal }}</p>
          <div class="release-meta"><CalendarDays :size="13" />开始于 {{ formatDate(current.startedAt) }}</div>
        </div>
        <div class="release-actions">
          <button class="button" type="button" @click="openSummary(current)">阶段摘要 <ExternalLink :size="12" /></button>
          <button class="button primary" type="button" @click="publishRelease(current)">完成并发布</button>
        </div>
      </section>

      <section v-else class="settings-section release-empty-current">
        <strong>当前没有进行中的版本</strong>
        <p>可以激活一个规划版本，或创建新的当前版本。</p>
      </section>

      <section class="settings-section" aria-labelledby="release-history-title">
        <div class="settings-section-heading">
          <div><h2 id="release-history-title">版本记录</h2><p>默认只读取当前阶段；需要调查历史原因时再沿 Previous Release 追溯。</p></div>
          <span class="settings-count">{{ releases.length }}</span>
        </div>
        <ol class="release-list">
          <li v-for="release in releases" :key="release.id" :class="`release-${release.status}`">
            <span class="release-status-mark"><Check v-if="release.status === 'released'" :size="13" /><Circle v-else :size="11" /></span>
            <div class="release-list-content">
              <div class="release-title-line">
                <h3>{{ release.name }}</h3>
                <span class="release-status-badge" :data-status="release.status">
                  {{ release.status === 'active' ? '进行中' : release.status === 'released' ? '已发布' : '规划中' }}
                </span>
              </div>
              <p>{{ release.summary }}</p>
              <div class="release-meta">
                <code>{{ release.id }}</code>
                <span>{{ formatDate(release.startedAt) }}<template v-if="release.releasedAt"> ～ {{ formatDate(release.releasedAt) }}</template></span>
                <span v-if="release.previous">基于 {{ release.previous.toUpperCase() }}</span>
                <span v-if="release.gitTag">Tag {{ release.gitTag }}</span>
              </div>
            </div>
            <div class="release-row-actions">
              <button class="button subtle" type="button" @click="openSummary(release)">查看摘要</button>
              <button v-if="release.status === 'planning'" class="button" type="button" :disabled="Boolean(current)" @click="activateRelease(release)">设为当前</button>
            </div>
          </li>
        </ol>
      </section>

      <footer class="settings-source-footer">
        <div><strong>Release Registry</strong><code>.workspace/releases/registry.json</code></div>
        <span>阶段摘要不复制专业 Space 的详细知识</span>
      </footer>
    </div>

    <BaseDialog :open="dialogOpen" title="创建项目版本" description="新版本在当前累计知识上继续演进。" width="md" @close="dialogOpen = false">
      <form class="dialog-form release-dialog-form" @submit.prevent="createRelease">
        <div class="release-dialog-grid">
          <label><span>Release ID</span><input v-model.trim="draft.id" autocomplete="off" spellcheck="false" /></label>
          <label><span>版本名称</span><input v-model="draft.name" autocomplete="off" /></label>
          <label><span>开始时间</span><input v-model="draft.startedAt" type="date" /></label>
          <label class="release-dialog-wide"><span>版本目标</span><input v-model="draft.goal" autocomplete="off" /></label>
          <label class="release-dialog-wide"><span>版本简介</span><textarea v-model="draft.summary" rows="3" /></label>
          <label class="release-active-option" :class="{ disabled: Boolean(current) }">
            <input v-model="draft.makeActive" type="checkbox" :disabled="Boolean(current)" />
            <span>创建后设为当前版本<small v-if="current">已有进行中的版本，新版本将保持规划状态。</small></span>
          </label>
        </div>
        <p v-if="errorMessage" class="manifest-form-error" role="alert">{{ errorMessage }}</p>
        <div class="dialog-actions">
          <button class="button" type="button" @click="dialogOpen = false">取消</button>
          <button class="button primary" type="submit" :disabled="submitting">{{ submitting ? '创建中…' : '创建版本' }}</button>
        </div>
      </form>
    </BaseDialog>
  </section>
</template>
