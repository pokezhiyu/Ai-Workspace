import type { GitAdapter, GitDiffResult, GitOperationResult, GitRepositoryStatus } from '@/types/git'
import type { WorkspaceEntry } from '@/types/workspace'

interface ErrorPayload {
  error?: string
  code?: string
  detail?: string
}

export class GitAdapterError extends Error {
  constructor(message: string, readonly code = 'GIT_ERROR', readonly technicalMessage = message) {
    super(message)
    this.name = 'GitAdapterError'
  }
}

async function request<T>(path: string, body?: object): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api/git/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : '{}',
    })
  } catch {
    throw new GitAdapterError('本地 Git 服务不可用。请通过 npm run dev 或 npm run preview 启动 Workspace。', 'SERVICE_UNAVAILABLE')
  }
  const payload = await response.json() as T | ErrorPayload
  if (!response.ok) {
    const error = payload as ErrorPayload
    throw new GitAdapterError(error.error ?? 'Git 操作失败。', error.code, error.detail ?? error.error)
  }
  return payload as T
}

export class LocalGitHttpAdapter implements GitAdapter {
  initialize(): Promise<GitOperationResult> {
    return request('init')
  }

  configureRemote(name: string, url: string): Promise<GitOperationResult> {
    return request('remote', { name, url })
  }

  status(entries: WorkspaceEntry[]): Promise<GitRepositoryStatus> {
    return request('status', { entries })
  }

  diff(entries: WorkspaceEntry[]): Promise<GitDiffResult> {
    return request('diff', { entries })
  }

  pull(entries: WorkspaceEntry[]): Promise<GitOperationResult> {
    return request('pull', { entries })
  }

  commit(entries: WorkspaceEntry[], message: string): Promise<GitOperationResult> {
    return request('commit', { entries, message })
  }

  push(): Promise<GitOperationResult> {
    return request('push')
  }

  commitAndPush(entries: WorkspaceEntry[], message: string): Promise<GitOperationResult> {
    return request('commit-push', { entries, message })
  }
}
