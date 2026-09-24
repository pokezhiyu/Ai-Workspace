<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ArrowDownToLine from '@lucide/vue/dist/esm/icons/arrow-down-to-line.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import ChevronDown from '@lucide/vue/dist/esm/icons/chevron-down.mjs'
import CircleAlert from '@lucide/vue/dist/esm/icons/circle-alert.mjs'
import Clock3 from '@lucide/vue/dist/esm/icons/clock-3.mjs'
import FileDiff from '@lucide/vue/dist/esm/icons/file-diff.mjs'
import GitFork from '@lucide/vue/dist/esm/icons/git-fork.mjs'
import GitBranch from '@lucide/vue/dist/esm/icons/git-branch.mjs'
import LoaderCircle from '@lucide/vue/dist/esm/icons/loader-circle.mjs'
import RefreshCw from '@lucide/vue/dist/esm/icons/refresh-cw.mjs'
import Send from '@lucide/vue/dist/esm/icons/send.mjs'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { GitAdapterError, LocalGitHttpAdapter } from '@/adapters/git'
import { useToast } from '@/composables/useToast'
import { useWorkspaceStore } from '@/stores/workspace'
import type { GitChangedFile, GitRepositoryStatus } from '@/types/git'

type Operation = 'status' | 'connect' | 'changes' | 'pull' | 'upload' | 'diff' | null
type FriendlyState = 'disconnected' | 'pending' | 'changes' | 'syncing' | 'synced' | 'remote' | 'conflict' | 'failure'

const store = useWorkspaceStore()
const git = new LocalGitHttpAdapter()
const { toast } = useToast()
const status = ref<GitRepositoryStatus | null>(null)
const loading = ref(true)
const operation = ref<Operation>(null)
const errorMessage = ref('')
const technicalError = ref('')
const successMessage = ref('')
const remoteUrl = ref('')
const commitMessage = ref('')
const changesVisible = ref(false)
const uploadDialogOpen = ref(false)
const advancedOpen = ref(false)
const diff = ref('')
const diffTruncated = ref(false)

const isRepository = computed(() => status.value?.isRepository === true)
const isTemplateSource = computed(() => status.value?.remotePurpose === 'template-source')
const isConnected = computed(() => isRepository.value
  && status.value?.remotePurpose === 'project'
  && Boolean(status.value.remote && status.value.remoteUrl))
const changes = computed(() => status.value?.changedFiles ?? [])
const hasConflict = computed(() => status.value?.state === 'conflict' || status.value?.state === 'diverged')
const changeCounts = computed(() => changes.value.reduce((result, file) => {
  if (file.kind === 'added' || file.kind === 'untracked' || file.kind === 'copied') result.added += 1
  else if (file.kind === 'deleted') result.deleted += 1
  else result.modified += 1
  return result
}, { added: 0, modified: 0, deleted: 0 }))
const canSaveAndUpload = computed(() => isConnected.value
  && (changes.value.length > 0 || (status.value?.ahead ?? 0) > 0)
  && !hasConflict.value
  && !operation.value)

const friendlyState = computed<FriendlyState>(() => {
  if (operation.value === 'connect' || operation.value === 'pull' || operation.value === 'upload') return 'syncing'
  if (errorMessage.value) return 'failure'
  if (!isConnected.value) return 'disconnected'
  if (hasConflict.value) return 'conflict'
  if (!status.value?.hasCommits || !status.value?.upstream) return 'pending'
  if (status.value?.behind) return 'remote'
  if (changes.value.length || status.value?.ahead) return 'changes'
  return 'synced'
})

const stateContent = computed(() => {
  switch (friendlyState.value) {
    case 'disconnected': return { label: '未连接 GitHub', title: '连接后即可保存与共享项目', description: '系统会自动准备本地版本记录，无需输入 Git 命令。' }
    case 'pending': return { label: '尚未首次上传', title: 'GitHub 已连接', description: '当前项目还没有上传到 GitHub。完成一次“保存并上传”即可建立共享版本。' }
    case 'changes': return { label: '有新的本地修改', title: '工作内容等待保存', description: '先查看本次修改，确认后填写一句工作说明并上传。' }
    case 'syncing': return { label: '正在同步', title: '正在处理项目内容', description: '请保持页面打开，完成后会显示结果。' }
    case 'remote': return { label: '远程有更新', title: 'GitHub 上有新的项目内容', description: '获取最新内容后再开始工作，可以减少内容冲突。' }
    case 'conflict': return { label: '发现内容冲突', title: '需要处理冲突后继续', description: '你和其他成员修改了相同内容。为避免覆盖，系统已停止同步。' }
    case 'failure': return { label: '同步失败', title: '本次操作没有完成', description: errorMessage.value }
    default: return { label: '已同步', title: '当前项目已是最新状态', description: '本地内容与 GitHub 保持一致，可以继续工作。' }
  }
})

const projectName = computed(() => repositoryDisplayName(status.value?.remoteUrl ?? ''))
const suggestedMessage = computed(() => {
  const counts = changeCounts.value
  const segments = [
    counts.added ? `新增 ${counts.added} 个文件` : '',
    counts.modified ? `修改 ${counts.modified} 个文件` : '',
    counts.deleted ? `删除 ${counts.deleted} 个文件` : '',
  ].filter(Boolean)
  if (changes.value.length === 1) return `${changeLabel(changes.value[0]!)} ${fileDisplayName(changes.value[0]!.path)}`
  return segments.length ? `更新项目：${segments.join('，')}` : '上传已保存的本地版本'
})

function fileDisplayName(path: string): string {
  return path.split('/').at(-1) ?? path
}

function repositoryDisplayName(url: string): string {
  const normalized = url.replace(/\\/g, '/').replace(/\.git$/i, '')
  const githubMatch = normalized.match(/github\.com(?::|\/)([^/]+)\/([^/]+)$/i)
  if (githubMatch) return `${githubMatch[1]} / ${githubMatch[2]}`
  const parts = normalized.split('/').filter(Boolean)
  return parts.at(-1) ?? status.value?.repositoryName ?? '当前项目'
}

function isGithubUrl(value: string): boolean {
  return /^(?:https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?|git@github\.com:[^/\s]+\/[^/\s]+(?:\.git)?|ssh:\/\/git@github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?)$/i.test(value.trim())
}

function ensureSavedEditor(): boolean {
  if (!store.hasUnsavedChanges) return true
  errorMessage.value = '当前文档还有未保存的修改。请先保存文档，再同步项目。'
  technicalError.value = 'Markdown editor contains unsaved changes.'
  return false
}

function clearFeedback(): void {
  errorMessage.value = ''
  technicalError.value = ''
  successMessage.value = ''
}

function friendlyError(error: unknown): string {
  if (!(error instanceof GitAdapterError)) return '同步没有完成，请稍后重试。'
  switch (error.code) {
    case 'DIRTY_WORKTREE': return '当前还有未保存的本地修改，请先保存并上传，再获取最新内容。'
    case 'GIT_CONFLICT':
    case 'PULL_CONFLICT': return '发现内容冲突。你和其他成员修改了相同内容，需要处理冲突后才能继续同步。'
    case 'AUTH_REQUIRED':
    case 'AUTH_REQUIRED_AFTER_COMMIT': return error.message
    case 'REMOTE_UPDATE_REQUIRED': return 'GitHub 上有新的内容，请先获取最新内容后再上传。'
    case 'PULL_FAILED': return error.message
    case 'NETWORK_ERROR': return '暂时无法连接 GitHub，请检查网络后重试。'
    case 'NO_REMOTE': return '当前项目还没有连接 GitHub，请先完成连接。'
    case 'TEMPLATE_REMOTE_PROTECTED': return '当前地址是 Base Template 来源，请连接你自己的 GitHub 项目。'
    case 'NOTHING_TO_COMMIT': return '没有发现需要保存的项目修改。'
    case 'SERVICE_UNAVAILABLE': return '本地同步服务没有启动。请重新启动 Workspace 后再试。'
    case 'GIT_UNAVAILABLE': return '当前电脑没有可用的 Git。安装 Git 后即可使用 GitHub 同步。'
    case 'PUSH_FAILED_AFTER_COMMIT': return '本次工作已保存在本地，但尚未上传。请查看高级信息并重试。'
    default: return '同步没有完成。你可以重试，或在高级信息中查看技术详情。'
  }
}

function applyError(error: unknown): void {
  errorMessage.value = friendlyError(error)
  technicalError.value = error instanceof GitAdapterError ? error.technicalMessage : error instanceof Error ? error.message : String(error)
}

function syncRemoteDraft(): void {
  remoteUrl.value = status.value?.remotePurpose === 'project' ? status.value.remoteUrl ?? '' : ''
}

async function fetchStatus(): Promise<GitRepositoryStatus> {
  const next = await git.status(store.entries)
  status.value = next
  syncRemoteDraft()
  return next
}

async function refreshStatus(): Promise<void> {
  if (!ensureSavedEditor()) return
  operation.value = 'status'
  clearFeedback()
  try {
    await fetchStatus()
  } catch (error) {
    applyError(error)
  } finally {
    loading.value = false
    operation.value = null
  }
}

async function connectGithub(): Promise<void> {
  if (!isGithubUrl(remoteUrl.value)) {
    errorMessage.value = '请输入完整的 GitHub 项目地址，例如 https://github.com/用户名/项目名.git。'
    technicalError.value = 'Invalid GitHub repository URL.'
    return
  }
  operation.value = 'connect'
  clearFeedback()
  try {
    if (!isRepository.value) {
      const initialized = await git.initialize()
      status.value = initialized.status
    }
    const result = await git.configureRemote(status.value?.remote ?? 'origin', remoteUrl.value)
    status.value = result.status
    syncRemoteDraft()
    successMessage.value = 'GitHub 已连接。现在可以查看修改并保存到 GitHub。'
    toast({ title: 'GitHub 已连接', description: projectName.value })
  } catch (error) {
    applyError(error)
    await fetchStatus().catch(() => undefined)
  } finally {
    operation.value = null
  }
}

async function showChanges(): Promise<void> {
  if (!ensureSavedEditor()) return
  operation.value = 'changes'
  clearFeedback()
  try {
    await fetchStatus()
    changesVisible.value = true
  } catch (error) {
    applyError(error)
  } finally {
    operation.value = null
  }
}

async function pullLatest(): Promise<void> {
  if (!ensureSavedEditor()) return
  operation.value = 'pull'
  clearFeedback()
  try {
    const result = await git.pull(store.entries)
    if (result.workspaceEntries) await store.replaceWorkspaceSnapshot(result.workspaceEntries)
    status.value = result.status
    changesVisible.value = false
    diff.value = ''
    successMessage.value = result.outcome === 'up-to-date' ? '当前已经是最新版本。' : '已获取最新项目内容。'
    toast({ title: successMessage.value, description: result.outcome === 'up-to-date' ? '没有发现需要更新的内容。' : 'Workspace 已刷新。' })
  } catch (error) {
    applyError(error)
  } finally {
    operation.value = null
  }
}

async function openUploadDialog(): Promise<void> {
  if (!ensureSavedEditor()) return
  operation.value = 'status'
  clearFeedback()
  try {
    await fetchStatus()
    if (!changes.value.length && !(status.value?.ahead ?? 0)) {
      successMessage.value = '当前没有需要保存或上传的修改。'
      return
    }
    if (!commitMessage.value.trim()) commitMessage.value = suggestedMessage.value
    uploadDialogOpen.value = true
  } catch (error) {
    applyError(error)
  } finally {
    operation.value = null
  }
}

async function confirmUpload(): Promise<void> {
  const onlyPush = !changes.value.length && (status.value?.ahead ?? 0) > 0
  if (!onlyPush && !commitMessage.value.trim()) return
  operation.value = 'upload'
  clearFeedback()
  try {
    const result = onlyPush ? await git.push() : await git.commitAndPush(store.entries, commitMessage.value)
    status.value = result.status
    uploadDialogOpen.value = false
    changesVisible.value = false
    diff.value = ''
    commitMessage.value = ''
    successMessage.value = '已成功保存并上传到 GitHub。'
    toast({ title: '保存并上传成功', description: result.commit ? `版本记录 ${result.commit}` : '本地版本已上传。' })
  } catch (error) {
    uploadDialogOpen.value = false
    applyError(error)
    await fetchStatus().catch(() => undefined)
  } finally {
    operation.value = null
  }
}

async function loadDiff(): Promise<void> {
  if (!ensureSavedEditor()) return
  operation.value = 'diff'
  clearFeedback()
  try {
    const result = await git.diff(store.entries)
    diff.value = result.patch
    diffTruncated.value = result.truncated
    await fetchStatus()
  } catch (error) {
    applyError(error)
  } finally {
    operation.value = null
  }
}

function changeLabel(file: GitChangedFile): string {
  return { added: '新增', modified: '修改', deleted: '删除', renamed: '重命名', copied: '复制', untracked: '新增', conflicted: '冲突' }[file.kind]
}

function stateIcon(): typeof Check {
  if (friendlyState.value === 'syncing') return LoaderCircle
  if (friendlyState.value === 'conflict' || friendlyState.value === 'failure') return CircleAlert
  if (friendlyState.value === 'pending' || friendlyState.value === 'remote') return Clock3
  return Check
}

onMounted(() => {
  if (!store.loading) {
    void refreshStatus()
    return
  }

  const stop = watch(() => store.loading, (isLoading) => {
    if (isLoading) return
    stop()
    void refreshStatus()
  }, { flush: 'post' })
})
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header sync-page-header">
        <div><span class="eyebrow">Project sync</span><h1>GitHub 同步</h1><p>获取团队最新内容，并把本次工作保存到 GitHub。日常使用不需要输入 Git 命令。</p></div>
        <button class="button" type="button" :disabled="Boolean(operation)" @click="refreshStatus"><RefreshCw :size="13" :class="{ spin: operation === 'status' }" />刷新状态</button>
      </header>

      <div v-if="loading" class="git-loading-state" role="status"><LoaderCircle class="spin" :size="16" /><span>正在检查项目同步状态…</span></div>

      <section v-else-if="!isConnected" class="git-connect-section" aria-labelledby="github-connect-title">
        <div class="git-connect-heading"><span class="git-provider-icon"><GitFork :size="19" /></span><div><h2 id="github-connect-title">连接 GitHub</h2><p>连接后，可以把当前项目保存到 GitHub，也可以让其他成员获取最新项目内容。</p></div></div>
        <p v-if="isTemplateSource" class="git-template-source-note">当前目录来自 Base Template。模板仓库不会作为项目同步目标，请连接你自己的 GitHub 项目。</p>
        <form class="git-connect-form" @submit.prevent="connectGithub">
          <label for="github-url">GitHub 项目地址</label>
          <div><input id="github-url" v-model.trim="remoteUrl" type="text" autocomplete="off" spellcheck="false" placeholder="https://github.com/用户名/项目名.git" /><button class="button primary" type="submit" :disabled="operation === 'connect' || !remoteUrl"><LoaderCircle v-if="operation === 'connect'" class="spin" :size="13" /><GitFork v-else :size="13" />{{ operation === 'connect' ? '连接中…' : '连接 GitHub' }}</button></div>
          <small>如果当前项目还没有版本记录，系统会自动完成准备。登录凭据只由系统 GitHub 账户管理。</small>
        </form>
      </section>

      <template v-else>
        <section class="git-status-overview" :data-state="friendlyState" aria-labelledby="git-status-title">
          <div class="git-status-mark"><component :is="stateIcon()" :class="{ spin: friendlyState === 'syncing' }" :size="18" /></div>
          <div class="git-status-copy"><span class="git-status-label">{{ stateContent.label }}</span><h2 id="git-status-title">{{ stateContent.title }}</h2><p>{{ stateContent.description }}</p><span class="git-project-name"><GitFork :size="12" />{{ projectName }}</span></div>
        </section>
        <section class="git-primary-actions" aria-label="GitHub 同步操作">
          <button type="button" :disabled="Boolean(operation) || hasConflict" @click="pullLatest"><span><ArrowDownToLine :size="17" /></span><strong>{{ operation === 'pull' ? '正在获取…' : '获取最新内容' }}</strong><small>获取其他成员最新保存的项目内容</small></button>
          <button type="button" :disabled="Boolean(operation)" @click="showChanges"><span><FileDiff :size="17" /></span><strong>{{ operation === 'changes' ? '正在检查…' : '查看本次修改' }}</strong><small>确认新增、修改和删除的文件</small></button>
          <button class="primary" type="button" :disabled="!canSaveAndUpload" @click="openUploadDialog"><span><Send :size="17" /></span><strong>保存并上传</strong><small>{{ canSaveAndUpload ? '保存为新版本并上传到 GitHub' : '当前没有需要上传的修改' }}</small></button>
        </section>
      </template>

      <p v-if="successMessage" class="git-operation-feedback success" role="status"><Check :size="14" />{{ successMessage }}</p>
      <p v-if="errorMessage" class="git-operation-feedback error" role="alert"><CircleAlert :size="14" /><span><strong>{{ errorMessage }}</strong><small v-if="technicalError">技术详情可在“高级信息”中查看。</small></span></p>

      <section v-if="isConnected && changesVisible" class="settings-section git-changes-section" aria-labelledby="git-changes-title">
        <div class="settings-section-heading"><div><h2 id="git-changes-title">本次修改</h2><p>这些文件会在下一次“保存并上传”时形成一条版本记录。</p></div><button class="button subtle" type="button" @click="changesVisible = false">收起</button></div>
        <div v-if="changes.length" class="git-change-summary" aria-label="修改统计"><span><strong>{{ changeCounts.added }}</strong> 新增</span><span><strong>{{ changeCounts.modified }}</strong> 修改</span><span><strong>{{ changeCounts.deleted }}</strong> 删除</span></div>
        <ul v-if="changes.length" class="git-change-list"><li v-for="file in changes" :key="`${file.code}:${file.path}`"><span class="git-change-kind" :data-kind="file.kind">{{ changeLabel(file) }}</span><code>{{ file.path }}</code></li></ul>
        <div v-else class="git-clean-state"><Check :size="15" /><span>当前没有需要保存的文件修改。</span></div>
      </section>

      <details v-if="isRepository || technicalError" class="git-advanced" :open="advancedOpen" @toggle="advancedOpen = ($event.target as HTMLDetailsElement).open">
        <summary><span>高级信息</span><ChevronDown :size="13" /></summary>
        <div class="git-advanced-content">
          <dl v-if="isRepository" class="git-config-grid">
            <div><dt>Repository</dt><dd>{{ status?.repositoryName }}</dd></div><div><dt>Remote</dt><dd>{{ isTemplateSource ? '未配置项目连接' : status?.remote ?? '未配置' }}</dd></div>
            <div><dt>Branch</dt><dd><GitBranch :size="12" />{{ status?.branch ?? 'detached HEAD' }}</dd></div><div><dt>Git Status</dt><dd>{{ status?.state }}</dd></div>
            <div><dt>Commit</dt><dd>{{ status?.ahead ? `${status.ahead} 个待上传` : '无待上传提交' }}</dd></div><div class="git-config-wide"><dt>Repository URL</dt><dd><code>{{ isTemplateSource ? '—' : status?.remoteUrl ?? '—' }}</code></dd></div>
          </dl>
          <form v-if="isConnected" class="git-advanced-remote" @submit.prevent="connectGithub"><label for="advanced-github-url">更新 GitHub 项目地址</label><div><input id="advanced-github-url" v-model.trim="remoteUrl" autocomplete="off" spellcheck="false" /><button class="button" type="submit" :disabled="Boolean(operation) || !remoteUrl">更新连接</button></div></form>
          <div v-if="technicalError" class="git-technical-error"><strong>Git Error</strong><pre>{{ technicalError }}</pre></div>
          <div class="git-advanced-actions"><button class="button" type="button" :disabled="Boolean(operation)" @click="loadDiff"><FileDiff :size="13" />{{ operation === 'diff' ? '读取中…' : '查看技术 Diff' }}</button></div>
          <div v-if="diff" class="git-diff-section"><div class="settings-section-heading"><div><h2>Diff</h2><p>供开发人员排查当前文件变化。</p></div><span v-if="diffTruncated" class="settings-count">已截断</span></div><pre><code>{{ diff }}</code></pre></div>
        </div>
      </details>

      <footer class="settings-source-footer"><div><strong>安全同步</strong><code>Workspace → Local Git → GitHub</code></div><span>不会保存 GitHub 密码或 Token；内容冲突不会被自动覆盖</span></footer>
    </div>

    <BaseDialog :open="uploadDialogOpen" title="保存并上传" description="确认本次修改，并用一句话说明这次完成的工作。" width="md" @close="uploadDialogOpen = false">
      <form class="dialog-form git-upload-dialog" @submit.prevent="confirmUpload">
        <div class="git-upload-summary">
          <div v-if="changes.length" class="git-change-summary"><span><strong>{{ changeCounts.added }}</strong> 新增</span><span><strong>{{ changeCounts.modified }}</strong> 修改</span><span><strong>{{ changeCounts.deleted }}</strong> 删除</span></div>
          <p v-else>已有 {{ status?.ahead ?? 0 }} 个本地版本等待上传。</p>
          <ul v-if="changes.length"><li v-for="file in changes.slice(0, 6)" :key="`${file.code}:${file.path}`"><span>{{ changeLabel(file) }}</span><code>{{ file.path }}</code></li></ul>
          <small v-if="changes.length > 6">另有 {{ changes.length - 6 }} 个文件</small>
        </div>
        <label v-if="changes.length" for="commit-message"><span>本次工作说明</span><textarea id="commit-message" v-model="commitMessage" rows="3" maxlength="180" placeholder="例如：完成登录页面设计" /></label>
        <p v-if="changes.length" class="git-message-hint">{{ commitMessage.length }} / 180 · 这段说明会成为本次版本记录</p>
        <div class="dialog-actions"><button class="button" type="button" :disabled="operation === 'upload'" @click="uploadDialogOpen = false">取消</button><button class="button primary" type="submit" :disabled="operation === 'upload' || (changes.length > 0 && !commitMessage.trim())"><LoaderCircle v-if="operation === 'upload'" class="spin" :size="13" /><Send v-else :size="13" />{{ operation === 'upload' ? '正在保存…' : '确认保存并上传' }}</button></div>
      </form>
    </BaseDialog>
  </section>
</template>
