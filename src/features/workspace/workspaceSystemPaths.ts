import type { WorkspaceEntry } from '@/types/workspace'
import { normalizePath } from '@/utils/path'

export const WORKSPACE_SYSTEM_DIRECTORY = '.workspace'
export const WORKSPACE_SYSTEM_PATH_ROOTS = [
  WORKSPACE_SYSTEM_DIRECTORY,
  '空间配置',
] as const

export function isWorkspaceSystemPath(path: string): boolean {
  const normalized = normalizePath(path)
  return WORKSPACE_SYSTEM_PATH_ROOTS.some(
    (root) => normalized === root || normalized.startsWith(`${root}/`),
  )
}

export function projectKnowledgeEntries(entries: WorkspaceEntry[]): WorkspaceEntry[] {
  return entries.filter((entry) => !isWorkspaceSystemPath(entry.path))
}
