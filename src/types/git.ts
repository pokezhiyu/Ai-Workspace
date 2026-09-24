import type { WorkspaceEntry } from './workspace'

export type GitChangeKind = 'added' | 'modified' | 'deleted' | 'renamed' | 'copied' | 'untracked' | 'conflicted'
export type GitSyncState = 'not-repository' | 'clean' | 'changes' | 'conflict' | 'ahead' | 'behind' | 'diverged' | 'no-remote'
export type GitRemotePurpose = 'none' | 'project' | 'template-source'

export interface GitChangedFile {
  path: string
  previousPath?: string
  kind: GitChangeKind
  staged: boolean
  code: string
}

export interface GitRepositoryStatus {
  isRepository: boolean
  hasCommits: boolean
  repositoryRoot: string | null
  repositoryName: string | null
  branch: string | null
  remote: string | null
  remoteUrl: string | null
  remotePurpose: GitRemotePurpose
  upstream: string | null
  ahead: number
  behind: number
  state: GitSyncState
  changedFiles: GitChangedFile[]
  checkedAt: string
}

export interface GitDiffResult {
  patch: string
  truncated: boolean
}

export interface GitOperationResult {
  message: string
  status: GitRepositoryStatus
  outcome?: 'updated' | 'up-to-date'
  workspaceEntries?: WorkspaceEntry[]
  commit?: string
  pushed?: boolean
}

export interface GitAdapter {
  initialize(): Promise<GitOperationResult>
  configureRemote(name: string, url: string): Promise<GitOperationResult>
  status(entries: WorkspaceEntry[]): Promise<GitRepositoryStatus>
  diff(entries: WorkspaceEntry[]): Promise<GitDiffResult>
  pull(entries: WorkspaceEntry[]): Promise<GitOperationResult>
  commit(entries: WorkspaceEntry[], message: string): Promise<GitOperationResult>
  push(): Promise<GitOperationResult>
  commitAndPush(entries: WorkspaceEntry[], message: string): Promise<GitOperationResult>
}
