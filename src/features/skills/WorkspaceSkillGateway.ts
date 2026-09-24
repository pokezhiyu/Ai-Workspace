import type { WorkspaceSkill, WorkspaceSkillDiscoveryResult, WorkspaceSkillRegistry } from '@/types/skills'

interface SkillDeleteResponse {
  removedFiles: boolean
  scope: WorkspaceSkill['scope']
}

interface SkillImportResponse {
  imported: true
  id: string
}

interface ErrorPayload {
  error?: string
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = await response.json() as T & ErrorPayload
  if (!response.ok) throw new Error(payload.error || 'Skill 操作失败。')
  return payload
}

export class WorkspaceSkillGateway {
  async discover(): Promise<WorkspaceSkillDiscoveryResult> {
    const response = await fetch('/api/workspace-skills/scan', { method: 'POST' })
    return readResponse<WorkspaceSkillDiscoveryResult>(response)
  }

  async persist(registry: WorkspaceSkillRegistry): Promise<void> {
    const response = await fetch('/api/workspace-skills/registry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registry }),
    })
    await readResponse<{ saved: true }>(response)
  }

  async remove(skill: WorkspaceSkill): Promise<SkillDeleteResponse> {
    const response = await fetch('/api/workspace-skills/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: skill.id }),
    })
    return readResponse<SkillDeleteResponse>(response)
  }

  async import(id: string): Promise<SkillImportResponse> {
    const response = await fetch('/api/workspace-skills/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    return readResponse<SkillImportResponse>(response)
  }
}
