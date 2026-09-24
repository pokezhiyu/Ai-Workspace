import type { WorkspaceFileAdapter } from '@/adapters/workspace-file'
import type { WorkspaceSkill, WorkspaceSkillImportCandidate, WorkspaceSkillRegistry } from '@/types/skills'
import { WorkspaceSkillGateway } from './WorkspaceSkillGateway'
import {
  getEnabledSkills,
  parseWorkspaceSkillRegistry,
  serializeWorkspaceSkillRegistry,
  WORKSPACE_SKILL_INSTALL_PATH,
  WORKSPACE_SKILL_REGISTRY_PATH,
} from './workspaceSkillRegistry'

export class WorkspaceSkillRegistryService {
  constructor(
    private readonly adapter: WorkspaceFileAdapter,
    private readonly gateway = new WorkspaceSkillGateway(),
  ) {}

  async getRegistry(): Promise<WorkspaceSkillRegistry> {
    return parseWorkspaceSkillRegistry(await this.adapter.read(WORKSPACE_SKILL_REGISTRY_PATH))
  }

  async getEnabledSkills(): Promise<WorkspaceSkill[]> {
    return getEnabledSkills(await this.getRegistry())
  }

  async rescan(): Promise<{ registry: WorkspaceSkillRegistry; externalCandidates: WorkspaceSkillImportCandidate[] }> {
    const [current, discovery] = await Promise.all([
      this.getRegistry().catch(() => this.emptyRegistry()),
      this.gateway.discover(),
    ])
    const previousById = new Map(current.skills.map((skill) => [skill.id, skill]))
    const skills = discovery.skills
      .map((skill) => {
        const previous = previousById.get(skill.id)
        if (!skill.health.valid) return { ...skill, status: 'invalid' as const, enabled: false }
        if (previous?.status === 'disabled' || previous?.enabled === false) {
          return { ...skill, status: 'disabled' as const, enabled: false }
        }
        return { ...skill, status: 'enabled' as const, enabled: true }
      })
      .sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'))
    const registry = await this.save({
      schemaVersion: '1.1.0',
      registryType: 'workspace-skill-registry',
      generatedAt: discovery.discoveredAt,
      sourceRoot: WORKSPACE_SKILL_INSTALL_PATH,
      sourceOfTruth: 'Each discovered Skill directory and its SKILL.md file.',
      management: {
        supported: ['discover', 'inspect', 'enable', 'disable', 'remove-reference', 'health-check'],
        planned: ['install', 'update'],
        excludedSkillIds: [],
      },
      discoveryRoots: discovery.roots,
      skills,
    })
    return { registry, externalCandidates: discovery.externalCandidates }
  }

  async import(id: string): Promise<{ registry: WorkspaceSkillRegistry; externalCandidates: WorkspaceSkillImportCandidate[] }> {
    await this.gateway.import(id)
    return this.rescan()
  }

  async setEnabled(id: string, enabled: boolean): Promise<WorkspaceSkillRegistry> {
    const registry = await this.getRegistry()
    const skill = registry.skills.find((candidate) => candidate.id === id)
    if (!skill) throw new Error('未找到该 Skill。')
    if (enabled && !skill.health.valid) throw new Error('配置异常的 Skill 不能启用，请先修复 SKILL.md。')
    return this.save({
      ...registry,
      generatedAt: new Date().toISOString(),
      skills: registry.skills.map((candidate) => candidate.id === id
        ? { ...candidate, enabled, status: enabled ? 'enabled' : 'disabled' }
        : candidate),
    })
  }

  async remove(id: string): Promise<{ registry: WorkspaceSkillRegistry; removedFiles: boolean }> {
    const registry = await this.getRegistry()
    const skill = registry.skills.find((candidate) => candidate.id === id)
    if (!skill) throw new Error('未找到该 Skill。')
    const result = await this.gateway.remove(skill)
    const excludedSkillIds = registry.management.excludedSkillIds.filter((skillId) => skillId !== id)
    const next = await this.save({
      ...registry,
      generatedAt: new Date().toISOString(),
      management: { ...registry.management, excludedSkillIds },
      skills: registry.skills.filter((candidate) => candidate.id !== id),
    })
    return { registry: next, removedFiles: result.removedFiles }
  }

  private async save(registry: WorkspaceSkillRegistry): Promise<WorkspaceSkillRegistry> {
    await this.gateway.persist(registry)
    const source = serializeWorkspaceSkillRegistry(registry)
    if (await this.adapter.exists(WORKSPACE_SKILL_REGISTRY_PATH)) await this.adapter.write(WORKSPACE_SKILL_REGISTRY_PATH, source)
    else {
      if (!await this.adapter.exists('.workspace/skills')) await this.adapter.createFolder('.workspace/skills')
      await this.adapter.createFile(WORKSPACE_SKILL_REGISTRY_PATH, source)
    }
    return registry
  }

  private emptyRegistry(): WorkspaceSkillRegistry {
    return {
      schemaVersion: '1.1.0',
      registryType: 'workspace-skill-registry',
      generatedAt: '',
      sourceRoot: '',
      sourceOfTruth: 'Each discovered Skill directory and its SKILL.md file.',
      management: {
        supported: [],
        planned: [],
        excludedSkillIds: [],
      },
      discoveryRoots: [],
      skills: [],
    }
  }
}
