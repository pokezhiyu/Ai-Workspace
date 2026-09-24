import type { WorkspaceFileAdapter } from '@/adapters/workspace-file'
import type { ProjectRelease, ProjectReleaseRegistry } from '@/types/releases'
import type { WorkspaceActiveRoleState } from '@/types/roles'
import type { WorkspaceEntry, WorkspaceManifest, WorkspaceManifestIdentity } from '@/types/workspace'
import { createReleaseSummary, serializeProjectReleaseRegistry } from '@/features/releases/workspaceReleaseRegistry'
import { serializeActiveRoleState } from '@/features/roles/workspaceRoleRegistry'
import { basename, dirname } from '@/utils/path'
import { createWorkspaceId, serializeWorkspaceManifest, WORKSPACE_MANIFEST_PATH } from './workspaceManifest'

export const PROJECT_HARNESS_PATH = '.workspace/harness/project.md'
export const WORKSPACE_INDEX_PATH = '.workspace/context/workspace-index.md'
export const ACTIVE_ROLES_PATH = '.workspace/roles/active.json'
export const RELEASE_REGISTRY_PATH = '.workspace/releases/registry.json'

const PROJECT_HOME_PATH = '开始阅读/项目入口/项目介绍.md'
const INITIAL_FOLDERS = [
  '开始阅读/项目入口',
  '产品空间/产品规划',
  '产品空间/需求文档',
  '产品空间/产品迭代',
  '产品空间/项目角色',
  '设计空间/设计规范',
  '设计空间/交互设计',
  '设计空间/UI-设计',
  '设计空间/项目角色',
  '技术空间/技术架构',
  '技术空间/前端',
  '技术空间/后端',
  '技术空间/技术决策',
  '技术空间/项目角色',
  '测试空间/测试计划',
  '测试空间/测试用例',
  '测试空间/验收记录',
  '测试空间/项目角色',
  '运维空间/部署',
  '运维空间/环境配置',
  '运维空间/发布记录',
  '运维空间/项目角色',
] as const

function yamlString(value: string): string {
  return JSON.stringify(value)
}

function projectHome(identity: WorkspaceManifestIdentity, date: string): string {
  return `---
id: PROJECT-OVERVIEW-001
title: ${yamlString(identity.name)}
type: overview
domain: workspace
version: 0.1.0
status: active
owner: product
updated: ${date}
related: []
---

# ${identity.name}

${identity.description}

## 项目目标

围绕项目简介建立清晰、可持续维护的目标，并在产品空间中逐步补充可验证的需求与验收标准。

## 项目范围

- 项目范围随正式需求文档持续明确。
- 不在聊天记录中保存唯一的项目事实。
- 重要变化同步到对应专业空间、Release 或 ADR。

## 当前阶段

项目已完成 Workspace 初始化，当前处于首个项目阶段。

## 项目成员与角色

Workspace 已提供产品、设计、开发、测试和运维五类标准角色。请在“设置 → 角色配置”中选择当前工作身份。

## 专业空间

- **产品空间**：目标、规划、需求与迭代。
- **设计空间**：设计规范、交互与 UI 方案。
- **技术空间**：架构、前后端实现与技术决策。
- **测试空间**：测试计划、用例与验收记录。
- **运维空间**：部署、环境与发布记录。
`
}

function workspaceIndex(identity: WorkspaceManifestIdentity, date: string): string {
  return `---
id: INDEX-WORKSPACE-001
title: ${yamlString(`${identity.name} Workspace 索引`)}
type: index
domain: workspace
version: 0.1.0
status: active
owner: product
updated: ${date}
related:
  - PROJECT-OVERVIEW-001
---

# ${identity.name} Workspace 索引

## Project

${identity.description}

## Current Version

V1 初始阶段

## Current Goal

建立项目的首批有效知识，并形成 Human 与 Agent 可以共同维护的工作上下文。

## Current Status

Workspace 已初始化。各专业 Space 已就绪，具体项目知识将随工作持续补充。

## Active Requirements

从产品空间中的需求文档按需加载。

## Architecture

从技术空间中的技术架构按需加载。

## Important Decisions

从技术空间中的技术决策按需加载。

## Engineering Rules

先读取 Manifest、Agent Protocol、Harness 与 Project Harness，再按任务加载相关知识。

## Roles

从 Role Registry 与 Active Roles 获取当前角色上下文。

## Recently Changed

- ${date}：完成 Workspace 初始化。
`
}

function projectHarness(identity: WorkspaceManifestIdentity, date: string): string {
  return `---
id: HARNESS-PROJECT-001
title: ${yamlString(`${identity.name} Project Harness`)}
type: harness-project
domain: workspace
version: 0.1.0
status: active
owner: engineering
updated: ${date}
related:
  - INDEX-WORKSPACE-001
---

# ${identity.name} Project Harness

## 项目身份

${identity.description}

## 项目规则扩展

当前项目暂未增加 Base Template Harness 之外的专属规则。

后续如需增加 API、数据库、测试、安全或发布规则，应作为明确的项目规则变更写入本文件或同目录的项目规则文件，并进入 Git 历史。不得在普通开发任务中静默修改 Harness。
`
}

function createInitialRelease(projectName: string, date: string): { release: ProjectRelease; registry: ProjectReleaseRegistry } {
  const release: ProjectRelease = {
    id: 'v1',
    name: 'V1 初始阶段',
    status: 'active',
    goal: `建立 ${projectName} 的首批有效知识与可执行项目上下文。`,
    summary: '完成 Workspace 初始化，开始沉淀需求、设计、技术、测试与运维知识。',
    startedAt: date,
    releasedAt: null,
    previous: null,
    gitTag: null,
    summaryPath: '.workspace/releases/v1.md',
  }
  return {
    release,
    registry: { schemaVersion: '1.0', current: release.id, releases: [release] },
  }
}

function upsertFolder(entries: Map<string, WorkspaceEntry>, path: string, timestamp: string): void {
  const parent = dirname(path)
  if (parent) upsertFolder(entries, parent, timestamp)
  if (entries.has(path)) return
  entries.set(path, {
    path,
    name: basename(path),
    kind: 'folder',
    createdAt: timestamp,
    updatedAt: timestamp,
  })
}

function upsertFile(entries: Map<string, WorkspaceEntry>, path: string, content: string, timestamp: string): void {
  const parent = dirname(path)
  if (parent) upsertFolder(entries, parent, timestamp)
  const current = entries.get(path)
  entries.set(path, {
    path,
    name: basename(path),
    kind: 'file',
    content,
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
    order: current?.order,
  })
}

export class WorkspaceInitializationService {
  constructor(private readonly files: WorkspaceFileAdapter) {}

  async initialize(
    currentManifest: WorkspaceManifest,
    input: Omit<WorkspaceManifestIdentity, 'id'>,
    activeRoleIds: string[] = [],
  ): Promise<{ identity: WorkspaceManifestIdentity; homePath: string }> {
    if (currentManifest.workspace.name.trim() || currentManifest.workspace.id.trim()) {
      throw new Error('Workspace 已完成初始化，不能再次生成项目身份。')
    }

    const name = input.name.trim()
    const description = input.description.trim()
    if (!name) throw new Error('请填写项目名称。')
    if (!description) throw new Error('请填写项目介绍。')
    const id = createWorkspaceId(name)
    if (!id) throw new Error('无法根据项目名称生成 Workspace ID。')

    const identity: WorkspaceManifestIdentity = {
      id,
      name,
      description,
      language: input.language || 'zh-CN',
    }
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10)
    const entries = new Map((await this.files.list()).map((entry) => [entry.path, { ...entry }]))

    for (const folder of INITIAL_FOLDERS) upsertFolder(entries, folder, timestamp)
    upsertFile(entries, WORKSPACE_MANIFEST_PATH, serializeWorkspaceManifest({
      ...currentManifest,
      workspace: identity,
    }), timestamp)
    upsertFile(entries, PROJECT_HOME_PATH, projectHome(identity, date), timestamp)
    upsertFile(entries, WORKSPACE_INDEX_PATH, workspaceIndex(identity, date), timestamp)
    upsertFile(entries, PROJECT_HARNESS_PATH, projectHarness(identity, date), timestamp)

    const activeRoles: WorkspaceActiveRoleState = {
      schemaVersion: '1.0',
      activeRoleIds: [...new Set(activeRoleIds)],
      updatedAt: timestamp,
      updatedBy: 'workspace-initialization',
    }
    upsertFile(entries, ACTIVE_ROLES_PATH, serializeActiveRoleState(activeRoles), timestamp)

    const { release, registry } = createInitialRelease(name, date)
    upsertFile(entries, RELEASE_REGISTRY_PATH, serializeProjectReleaseRegistry(registry), timestamp)
    upsertFile(entries, release.summaryPath, createReleaseSummary(release), timestamp)

    await this.files.replaceAll([...entries.values()])
    return { identity, homePath: PROJECT_HOME_PATH }
  }
}
