import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import os from 'node:os'
import path from 'node:path'
import type { Plugin } from 'vite'

interface WorkspaceSnapshotEntry {
  path: string
  name: string
  kind: 'file' | 'folder'
  content?: string
  createdAt: string
  updatedAt: string
  order?: number
}

interface GitResult {
  stdout: string
  stderr: string
  code: number
}

interface GitChangedFile {
  path: string
  previousPath?: string
  kind: 'added' | 'modified' | 'deleted' | 'renamed' | 'copied' | 'untracked' | 'conflicted'
  staged: boolean
  code: string
}

interface RepositoryStatus {
  isRepository: boolean
  hasCommits: boolean
  repositoryRoot: string | null
  repositoryName: string | null
  branch: string | null
  remote: string | null
  remoteUrl: string | null
  remotePurpose: 'none' | 'project' | 'template-source'
  upstream: string | null
  ahead: number
  behind: number
  state: 'not-repository' | 'clean' | 'changes' | 'conflict' | 'ahead' | 'behind' | 'diverged' | 'no-remote'
  changedFiles: GitChangedFile[]
  checkedAt: string
}

class GitCommandError extends Error {
  constructor(message: string, readonly result: GitResult, readonly errorCode = 'GIT_COMMAND_FAILED') {
    super(message)
  }
}

const MAX_BODY_SIZE = 20 * 1024 * 1024
const MAX_DIFF_SIZE = 300_000
const BASE_TEMPLATE_REGISTRY_PATH = path.join('workspace-template', '.workspace', 'base-template', 'registry.json')

function runGit(args: string[], cwd: string, timeoutMs = 30_000): Promise<GitResult> {
  return new Promise((resolve, reject) => {
    const safeDirectory = path.resolve(cwd).replace(/\\/g, '/')
    const child = spawn('git', ['-c', `safe.directory=${safeDirectory}`, ...args], {
      cwd,
      shell: false,
      windowsHide: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' },
    })
    let stdout = ''
    let stderr = ''
    let settled = false
    const timer = setTimeout(() => {
      child.kill()
      if (!settled) {
        settled = true
        reject(new GitCommandError('Git 操作超时。', { stdout, stderr, code: -1 }, 'GIT_TIMEOUT'))
      }
    }, timeoutMs)
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => { stdout += chunk })
    child.stderr.on('data', (chunk: string) => { stderr += chunk })
    child.on('error', (error) => {
      clearTimeout(timer)
      if (!settled) {
        settled = true
        reject(new GitCommandError(`无法启动 Git：${error.message}`, { stdout, stderr, code: -1 }, 'GIT_UNAVAILABLE'))
      }
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (settled) return
      settled = true
      const result = { stdout, stderr, code: code ?? -1 }
      if (result.code === 0) resolve(result)
      else reject(new GitCommandError(stderr.trim() || stdout.trim() || 'Git 命令执行失败。', result))
    })
  })
}

async function gitText(args: string[], cwd: string): Promise<string> {
  return (await runGit(args, cwd)).stdout.trim()
}

function safeRemoteUrl(value: string): string {
  try {
    const url = new URL(value)
    if (url.username || url.password) {
      url.username = ''
      url.password = ''
    }
    url.search = ''
    url.hash = ''
    return url.toString().replace(/\/$/, '')
  } catch {
    return value
  }
}

function repositoryIdentity(value: string): string {
  const normalized = value.trim().replace(/\\/g, '/').replace(/\.git$/i, '').replace(/\/$/, '')
  const githubMatch = normalized.match(/github\.com(?::|\/)([^/]+)\/([^/]+)$/i)
  return githubMatch
    ? `github.com/${githubMatch[1]!.toLowerCase()}/${githubMatch[2]!.toLowerCase()}`
    : normalized.toLowerCase()
}

async function baseTemplateSourceRepository(cwd: string): Promise<string | null> {
  try {
    const source = await fs.readFile(path.resolve(cwd, BASE_TEMPLATE_REGISTRY_PATH), 'utf8')
    const registry = JSON.parse(source) as { sourceRepository?: unknown }
    return typeof registry.sourceRepository === 'string' && registry.sourceRepository.trim()
      ? registry.sourceRepository.trim()
      : null
  } catch {
    return null
  }
}

async function isTemplateSourceRemote(cwd: string, remoteUrl: string): Promise<boolean> {
  const sourceRepository = await baseTemplateSourceRepository(cwd)
  return Boolean(sourceRepository && repositoryIdentity(sourceRepository) === repositoryIdentity(remoteUrl))
}

function changeKind(code: string): GitChangedFile['kind'] {
  if (code === '??') return 'untracked'
  if (code.includes('U') || code === 'AA' || code === 'DD') return 'conflicted'
  if (code.includes('R')) return 'renamed'
  if (code.includes('C')) return 'copied'
  if (code.includes('A')) return 'added'
  if (code.includes('D')) return 'deleted'
  return 'modified'
}

function parseStatus(source: string): GitChangedFile[] {
  return source.split(/\r?\n/).filter(Boolean).map((line) => {
    const code = line.slice(0, 2)
    const rawPath = line.slice(3).trim()
    const renameParts = rawPath.split(' -> ')
    const filePath = renameParts.at(-1) ?? rawPath
    return {
      path: filePath.replace(/^"|"$/g, ''),
      ...(renameParts.length > 1 ? { previousPath: renameParts[0]?.replace(/^"|"$/g, '') } : {}),
      kind: changeKind(code),
      staged: code[0] !== ' ' && code[0] !== '?',
      code,
    }
  })
}

async function repositoryRoot(cwd: string): Promise<string | null> {
  try {
    return await gitText(['rev-parse', '--show-toplevel'], cwd)
  } catch {
    return null
  }
}

async function getStatus(cwd: string): Promise<RepositoryStatus> {
  const root = await repositoryRoot(cwd)
  const checkedAt = new Date().toISOString()
  if (!root) {
    return {
      isRepository: false,
      hasCommits: false,
      repositoryRoot: null,
      repositoryName: null,
      branch: null,
      remote: null,
      remoteUrl: null,
      remotePurpose: 'none',
      upstream: null,
      ahead: 0,
      behind: 0,
      state: 'not-repository',
      changedFiles: [],
      checkedAt,
    }
  }
  const branch = await gitText(['branch', '--show-current'], cwd).catch(() => '')
  const hasCommits = Boolean(await gitText(['rev-parse', '--verify', 'HEAD'], cwd).catch(() => ''))
  const remotesText = await gitText(['remote'], cwd).catch(() => '')
  const remotes = remotesText.split(/\r?\n/).filter(Boolean)
  const upstream = await gitText(['rev-parse', '--abbrev-ref', '@{upstream}'], cwd).catch(() => '')
  const upstreamRemote = upstream.includes('/') ? upstream.split('/')[0] ?? '' : ''
  const remote = upstreamRemote || (remotes.includes('origin') ? 'origin' : remotes[0] ?? '')
  const remoteUrl = remote ? safeRemoteUrl(await gitText(['remote', 'get-url', remote], cwd).catch(() => '')) : ''
  const remotePurpose = !remoteUrl
    ? 'none'
    : await isTemplateSourceRemote(cwd, remoteUrl)
      ? 'template-source'
      : 'project'
  const changedFiles = parseStatus(await gitText(['status', '--porcelain=v1', '--untracked-files=all'], cwd))
  let ahead = 0
  let behind = 0
  if (upstream) {
    const counts = await gitText(['rev-list', '--left-right', '--count', `HEAD...${upstream}`], cwd).catch(() => '')
    const [aheadValue, behindValue] = counts.split(/\s+/).map(Number)
    ahead = Number.isFinite(aheadValue) ? aheadValue ?? 0 : 0
    behind = Number.isFinite(behindValue) ? behindValue ?? 0 : 0
  }
  const hasConflict = changedFiles.some((file) => file.kind === 'conflicted')
  const state = hasConflict
    ? 'conflict'
    : changedFiles.length
      ? 'changes'
      : !remote
        ? 'no-remote'
        : ahead && behind
          ? 'diverged'
          : ahead
            ? 'ahead'
            : behind
              ? 'behind'
              : 'clean'
  return {
    isRepository: true,
    hasCommits,
    repositoryRoot: root,
    repositoryName: path.basename(root),
    branch: branch || null,
    remote: remote || null,
    remoteUrl: remoteUrl || null,
    remotePurpose,
    upstream: upstream || null,
    ahead,
    behind,
    state,
    changedFiles,
    checkedAt,
  }
}

function safeWorkspacePath(root: string, relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!normalized || normalized.split('/').some((part) => part === '..' || part === '.')) throw new Error('Workspace 包含不安全路径。')
  const target = path.resolve(root, ...normalized.split('/'))
  const relation = path.relative(root, target)
  if (relation.startsWith('..') || path.isAbsolute(relation)) throw new Error('Workspace 路径超出同步目录。')
  return target
}

async function listTextFiles(root: string, current = root): Promise<string[]> {
  const results: string[] = []
  let items: Array<import('node:fs').Dirent>
  try {
    items = await fs.readdir(current, { withFileTypes: true })
  } catch {
    return results
  }
  for (const item of items) {
    const absolute = path.join(current, item.name)
    if (item.isSymbolicLink()) continue
    if (item.isDirectory()) results.push(...await listTextFiles(root, absolute))
    else if (item.isFile() && /\.(?:md|json)$/i.test(item.name)) results.push(path.relative(root, absolute).replace(/\\/g, '/'))
  }
  return results
}

function syncIndexPath(cwd: string): string {
  const workspaceKey = createHash('sha256').update(path.resolve(cwd)).digest('hex').slice(0, 16)
  return path.join(os.tmpdir(), 'ai-coding-workspace', workspaceKey, 'sync-index.json')
}

async function materializeWorkspace(entries: WorkspaceSnapshotEntry[], cwd: string): Promise<void> {
  const root = path.resolve(cwd, 'workspace-template')
  const files = entries.filter((entry) => entry.kind === 'file')
  if (files.length > 10_000) throw new Error('Workspace 文件数量超过本地同步上限。')
  const totalSize = files.reduce((size, entry) => size + Buffer.byteLength(entry.content ?? '', 'utf8'), 0)
  if (totalSize > MAX_BODY_SIZE) throw new Error('Workspace 文本内容超过本地同步上限。')
  await fs.mkdir(root, { recursive: true })
  const indexPath = syncIndexPath(cwd)
  let previousPaths: string[]
  try {
    const index = JSON.parse(await fs.readFile(indexPath, 'utf8')) as { paths?: unknown }
    previousPaths = Array.isArray(index.paths) ? index.paths.filter((value): value is string => typeof value === 'string') : []
  } catch {
    previousPaths = []
  }
  if (files.length === 0 && previousPaths.length > 0) {
    throw new Error('Workspace 文件快照为空，已停止同步以避免删除现有内容。')
  }
  const currentPaths = new Set(files.map((entry) => entry.path.replace(/\\/g, '/')))
  for (const previousPath of previousPaths) {
    if (currentPaths.has(previousPath)) continue
    const target = safeWorkspacePath(root, previousPath)
    await fs.rm(target, { force: true })
  }
  for (const entry of files) {
    const target = safeWorkspacePath(root, entry.path)
    const nextContent = entry.content ?? ''
    const currentContent = await fs.readFile(target, 'utf8').catch(() => null)
    if (currentContent === nextContent) continue
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, nextContent, 'utf8')
  }
  await fs.mkdir(path.dirname(indexPath), { recursive: true })
  await fs.writeFile(indexPath, `${JSON.stringify({ paths: [...currentPaths].sort() }, null, 2)}\n`, 'utf8')
}

async function readWorkspaceSnapshot(cwd: string): Promise<WorkspaceSnapshotEntry[]> {
  const root = path.resolve(cwd, 'workspace-template')
  const filePaths = await listTextFiles(root)
  const entries = new Map<string, WorkspaceSnapshotEntry>()
  for (const filePath of filePaths) {
    const segments = filePath.split('/')
    for (let index = 1; index < segments.length; index += 1) {
      const folderPath = segments.slice(0, index).join('/')
      if (!entries.has(folderPath)) {
        const timestamp = new Date().toISOString()
        entries.set(folderPath, { path: folderPath, name: segments[index - 1] ?? folderPath, kind: 'folder', createdAt: timestamp, updatedAt: timestamp })
      }
    }
    const absolute = safeWorkspacePath(root, filePath)
    const stats = await fs.stat(absolute)
    entries.set(filePath, {
      path: filePath,
      name: segments.at(-1) ?? filePath,
      kind: 'file',
      content: await fs.readFile(absolute, 'utf8'),
      createdAt: stats.birthtime.toISOString(),
      updatedAt: stats.mtime.toISOString(),
    })
  }
  return [...entries.values()]
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  let body = ''
  for await (const chunk of request) {
    body += String(chunk)
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_SIZE) throw new Error('请求内容超过本地同步上限。')
  }
  if (!body) return {}
  const parsed: unknown = JSON.parse(body)
  return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {}
}

function snapshotEntries(value: unknown): WorkspaceSnapshotEntry[] {
  if (!Array.isArray(value)) throw new Error('缺少 Workspace 文件快照。')
  return value.filter((entry): entry is WorkspaceSnapshotEntry => {
    if (typeof entry !== 'object' || entry === null) return false
    const item = entry as Partial<WorkspaceSnapshotEntry>
    return typeof item.path === 'string' && typeof item.name === 'string' && (item.kind === 'file' || item.kind === 'folder')
  })
}

function sendJson(response: ServerResponse, status: number, payload: object): void {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function classifyGitError(error: GitCommandError): { message: string; code: string; detail: string } {
  const detail = error.message
  if (/authentication failed|could not read username|permission denied \(publickey\)|terminal prompts disabled|http basic: access denied|response: 401|response: 403/i.test(detail)) {
    return { message: '需要先登录 GitHub 才能继续同步。', code: 'AUTH_REQUIRED', detail }
  }
  if (/non-fast-forward|fetch first|updates were rejected|failed to push some refs/i.test(detail)) {
    return { message: 'GitHub 上有更新，请先获取最新内容后再上传。', code: 'REMOTE_UPDATE_REQUIRED', detail }
  }
  if (/could not resolve host|failed to connect|connection timed out|network is unreachable|unable to access/i.test(detail)) {
    return { message: '暂时无法连接 GitHub，请检查网络后重试。', code: 'NETWORK_ERROR', detail }
  }
  return { message: detail, code: error.errorCode, detail }
}

function userFacingError(error: unknown): { message: string; code: string; detail?: string } {
  if (error instanceof GitCommandError) return classifyGitError(error)
  if (error instanceof Error) return { message: error.message, code: 'GIT_ERROR' }
  return { message: 'Git 操作失败。', code: 'GIT_ERROR' }
}

async function ensureRepository(cwd: string): Promise<RepositoryStatus> {
  const status = await getStatus(cwd)
  if (!status.isRepository) throw new GitCommandError('当前项目尚不是 Git Repository。', { stdout: '', stderr: '', code: 1 }, 'NOT_REPOSITORY')
  return status
}

async function ensureProjectRemote(cwd: string): Promise<RepositoryStatus & { remote: string; remotePurpose: 'project' }> {
  const status = await ensureRepository(cwd)
  if (status.remotePurpose === 'template-source') {
    throw new GitCommandError('当前 Remote 是 Base Template 来源，请先连接你自己的 GitHub 项目。', { stdout: '', stderr: '', code: 1 }, 'TEMPLATE_REMOTE_PROTECTED')
  }
  if (!status.remote) throw new GitCommandError('尚未配置 Git Remote，无法同步。', { stdout: '', stderr: '', code: 1 }, 'NO_REMOTE')
  return { ...status, remote: status.remote, remotePurpose: 'project' }
}

async function commitWorkspace(cwd: string, message: string): Promise<{ status: RepositoryStatus; commit: string }> {
  if (!message.trim()) throw new Error('Commit Message 不能为空。')
  if (message.trim().length > 180) throw new Error('Commit Message 不能超过 180 个字符。')
  const before = await ensureRepository(cwd)
  if (before.state === 'conflict') throw new GitCommandError('存在 Git 冲突，需要处理后继续同步。', { stdout: '', stderr: '', code: 1 }, 'GIT_CONFLICT')
  if (!before.changedFiles.length) throw new GitCommandError('当前没有可提交的文件变化。', { stdout: '', stderr: '', code: 1 }, 'NOTHING_TO_COMMIT')
  await runGit(['add', '-A'], cwd)
  await runGit(['commit', '-m', message.trim()], cwd)
  const commit = await gitText(['rev-parse', '--short', 'HEAD'], cwd)
  return { status: await getStatus(cwd), commit }
}

async function pushCurrent(cwd: string): Promise<void> {
  const status = await ensureProjectRemote(cwd)
  if (status.state === 'conflict') throw new GitCommandError('存在 Git 冲突，需要处理后继续同步。', { stdout: '', stderr: '', code: 1 }, 'GIT_CONFLICT')
  if (status.upstream) await runGit(['push'], cwd, 60_000)
  else if (status.branch) await runGit(['push', '--set-upstream', status.remote, status.branch], cwd, 60_000)
  else throw new GitCommandError('当前处于 detached HEAD，无法确定上传分支。', { stdout: '', stderr: '', code: 1 }, 'DETACHED_HEAD')
}

function validatedRemote(nameValue: unknown, urlValue: unknown): { name: string; url: string } {
  const name = typeof nameValue === 'string' ? nameValue.trim() : ''
  const url = typeof urlValue === 'string' ? urlValue.trim() : ''
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(name)) throw new Error('Remote 名称格式无效。')
  if (!url || /[\r\n\0]/.test(url)) throw new Error('Remote URL 格式无效。')
  if (/(?:gh[pousr]_|github_pat_|[?&](?:token|access_token)=)/i.test(url)) {
    throw new Error('Remote URL 不允许包含 Token，请使用系统 Git 认证。')
  }
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      if (parsed.username || parsed.password) throw new Error('Remote URL 不允许包含 Token 或账号凭据，请使用系统 Git 认证。')
    } catch (error) {
      if (error instanceof Error && error.message.includes('不允许包含')) throw error
      throw new Error('Remote URL 格式无效。')
    }
  }
  return { name, url }
}

function gitMiddleware(projectRoot: string) {
  return async (request: IncomingMessage, response: ServerResponse, next: () => void): Promise<void> => {
    const pathname = request.url?.split('?')[0] ?? ''
    if (!pathname.startsWith('/api/git/')) return next()
    if (request.method !== 'POST') return sendJson(response, 405, { error: '仅支持 POST 请求。', code: 'METHOD_NOT_ALLOWED' })
    try {
      const body = await readBody(request)
      if (pathname === '/api/git/init') {
        if (await repositoryRoot(projectRoot)) return sendJson(response, 409, { error: '当前项目已经是 Git Repository，不会重复初始化。', code: 'ALREADY_REPOSITORY' })
        try {
          await runGit(['init', '-b', 'main'], projectRoot)
        } catch {
          await runGit(['init'], projectRoot)
          await runGit(['symbolic-ref', 'HEAD', 'refs/heads/main'], projectRoot)
        }
        return sendJson(response, 200, { message: 'Git Repository 已初始化。', status: await getStatus(projectRoot) })
      }
      if (pathname === '/api/git/remote') {
        const current = await ensureRepository(projectRoot)
        const remote = validatedRemote(body.name, body.url)
        if (await isTemplateSourceRemote(projectRoot, remote.url)) {
          throw new GitCommandError('Base Template 仓库不能作为当前项目的同步地址，请连接你自己的 GitHub 项目。', { stdout: '', stderr: '', code: 1 }, 'TEMPLATE_REMOTE_PROTECTED')
        }
        const remotes = (await gitText(['remote'], projectRoot)).split(/\r?\n/).filter(Boolean)
        if (remotes.includes(remote.name)) await runGit(['remote', 'set-url', remote.name, remote.url], projectRoot)
        else await runGit(['remote', 'add', remote.name, remote.url], projectRoot)
        return sendJson(response, 200, { message: current.remote ? 'Git Remote 已更新。' : 'Git Remote 已配置。', status: await getStatus(projectRoot) })
      }
      if (pathname === '/api/git/status') {
        const status = await getStatus(projectRoot)
        return sendJson(response, 200, status)
      }
      if (pathname === '/api/git/diff') {
        await ensureRepository(projectRoot)
        await materializeWorkspace(snapshotEntries(body.entries), projectRoot)
        const unstaged = await gitText(['diff', '--no-ext-diff', '--unified=3'], projectRoot).catch(() => '')
        const staged = await gitText(['diff', '--cached', '--no-ext-diff', '--unified=3'], projectRoot).catch(() => '')
        const untracked = (await getStatus(projectRoot)).changedFiles.filter((file) => file.kind === 'untracked').map((file) => `未跟踪文件: ${file.path}`).join('\n')
        const patch = [staged && '# 已暂存变化\n' + staged, unstaged && '# 未暂存变化\n' + unstaged, untracked].filter(Boolean).join('\n\n') || '当前没有文本 Diff。'
        return sendJson(response, 200, { patch: patch.slice(0, MAX_DIFF_SIZE), truncated: patch.length > MAX_DIFF_SIZE })
      }
      if (pathname === '/api/git/pull') {
        await ensureProjectRemote(projectRoot)
        await materializeWorkspace(snapshotEntries(body.entries), projectRoot)
        const status = await getStatus(projectRoot)
        if (status.state === 'conflict') return sendJson(response, 409, { error: '存在 Git 冲突，需要处理后继续同步。', code: 'GIT_CONFLICT' })
        if (status.changedFiles.length) return sendJson(response, 409, { error: '当前存在未提交修改，请先提交或处理本地变更。', code: 'DIRTY_WORKTREE' })
        if (!status.remote) return sendJson(response, 409, { error: '尚未配置 Git Remote，无法拉取。', code: 'NO_REMOTE' })
        let pullOutput: GitResult
        try {
          pullOutput = await runGit(['pull', '--ff-only'], projectRoot, 60_000)
        } catch (error) {
          const detail = userFacingError(error)
          const technicalDetail = detail.detail ?? detail.message
          const isConflict = /not possible to fast-forward|non-fast-forward|diverg|conflict|need to specify how to reconcile/i.test(technicalDetail)
          return sendJson(response, 409, {
            error: isConflict
              ? '发现内容冲突。你和其他成员修改了相同内容，需要处理后才能继续同步。'
              : detail.code === 'GIT_COMMAND_FAILED' ? '暂时无法获取最新内容，请重试或查看技术详情。' : detail.message,
            code: isConflict ? 'PULL_CONFLICT' : detail.code === 'GIT_COMMAND_FAILED' ? 'PULL_FAILED' : detail.code,
            detail: technicalDetail,
          })
        }
        const currentStatus = await getStatus(projectRoot)
        const output = `${pullOutput.stdout}\n${pullOutput.stderr}`
        return sendJson(response, 200, {
          message: /already up[ -]to[ -]date/i.test(output) ? '当前已经是最新版本。' : '已获取 GitHub 最新内容。',
          outcome: /already up[ -]to[ -]date/i.test(output) ? 'up-to-date' : 'updated',
          status: currentStatus,
          workspaceEntries: await readWorkspaceSnapshot(projectRoot),
        })
      }
      if (pathname === '/api/git/commit' || pathname === '/api/git/commit-push') {
        await ensureRepository(projectRoot)
        if (pathname === '/api/git/commit-push') await ensureProjectRemote(projectRoot)
        await materializeWorkspace(snapshotEntries(body.entries), projectRoot)
        const message = typeof body.message === 'string' ? body.message : ''
        const committed = await commitWorkspace(projectRoot, message)
        if (pathname === '/api/git/commit') return sendJson(response, 200, { message: '本次工作已提交到本地 Git。', status: committed.status, commit: committed.commit, pushed: false })
        try {
          await pushCurrent(projectRoot)
        } catch (error) {
          const detail = userFacingError(error)
          return sendJson(response, 502, {
            error: detail.code === 'AUTH_REQUIRED' ? '本次工作已保存在本地，但需要先登录 GitHub 才能上传。' : `本次工作已保存在本地，但上传失败：${detail.message}`,
            code: detail.code === 'AUTH_REQUIRED' ? 'AUTH_REQUIRED_AFTER_COMMIT' : 'PUSH_FAILED_AFTER_COMMIT',
            detail: detail.detail ?? detail.message,
            commit: committed.commit,
          })
        }
        return sendJson(response, 200, { message: '本次工作已提交并上传。', status: await getStatus(projectRoot), commit: committed.commit, pushed: true })
      }
      if (pathname === '/api/git/push') {
        await pushCurrent(projectRoot)
        return sendJson(response, 200, { message: '本地提交已上传。', status: await getStatus(projectRoot), pushed: true })
      }
      return sendJson(response, 404, { error: '未知 Git 操作。', code: 'NOT_FOUND' })
    } catch (error) {
      const detail = userFacingError(error)
      const status = detail.code === 'NOT_REPOSITORY' ? 409 : 500
      return sendJson(response, status, { error: detail.message, code: detail.code, detail: detail.detail })
    }
  }
}

export function workspaceGitPlugin(projectRoot = process.cwd()): Plugin {
  return {
    name: 'workspace-local-git',
    configureServer(server) {
      server.middlewares.use(gitMiddleware(projectRoot))
    },
    configurePreviewServer(server) {
      server.middlewares.use(gitMiddleware(projectRoot))
    },
  }
}
