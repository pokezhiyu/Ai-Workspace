import type { WorkspaceSpaceDefinition } from '@/types/workspace'
import { normalizePath } from '@/utils/path'

export function resolveSpaceFromPath(
  path: string,
  spaces: WorkspaceSpaceDefinition[],
): WorkspaceSpaceDefinition | undefined {
  const normalized = normalizePath(path)
  return [...spaces]
    .sort((a, b) => b.path.length - a.path.length)
    .find((space) => {
      const spacePath = normalizePath(space.path)
      return normalized === spacePath || normalized.startsWith(`${spacePath}/`)
    })
}
