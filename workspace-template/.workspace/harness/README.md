---
id: HARNESS-WORKSPACE-V1
title: Workspace Harness V1
type: harness
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related: []
---

# Workspace Harness V1

Harness 是“当前项目应该如何工作”的说明书。它负责规定 Agent 如何使用 Workspace 已有系统，不保存这些系统的第二份状态。

## 边界

| 能力 | 职责 | 事实来源 |
| --- | --- | --- |
| Manifest | Workspace 身份与模块入口 | `.workspace/manifest.json` |
| Agent Protocol | 所有 Agent 共同遵守的系统级协议 | Manifest 的 `entrypoints.agentProtocol` |
| Harness | 当前项目的上下文、知识、工作、访问、Skill、Release 与交接规则 | Manifest 的 `entrypoints.harness` |
| Role System | Human Active Roles 与 Space 写入权限 | Role Registry、Active Roles、RoleAccessService / Workspace Guard |
| Skill System | 当前项目可用能力与健康状态 | Skill Registry 与项目内 `SKILL.md` |
| Release System | 当前项目阶段与阶段摘要 | Release Registry |
| Git | 文件历史与增量变更记录 | Git Repository |

Harness 只定义如何读取和使用这些事实来源，不复制当前 Role、Skill 列表、Release 状态、权限矩阵、Git 历史或 Agent Protocol 内容。

## 七类规则

1. [Context Loading](rules/context.md)
2. [Knowledge Rules](rules/knowledge.md)
3. [Work Rules](rules/work.md)
4. [Access Rules](rules/access.md)
5. [Skill Rules](rules/skills.md)
6. [Release / History Rules](rules/release.md)
7. [Handoff Rules](rules/handoff.md)

项目知识入口仍由 `.workspace/context/workspace-index.md` 提供；可复用文档模板仍位于 `.workspace/templates/`。它们由 Harness 按需引用，但不是运行时状态副本。

项目初始化时会生成 `.workspace/harness/project.md`。该文件只保存当前项目在 Framework 之上的专属规则与扩展；Agent 应先读取本 README 与七类稳定规则，再读取 Project Harness。未初始化模板中不预置项目规则。

## 修改规则

- Harness Framework 由 Base Template 提供稳定结构。
- Project Harness Rules 可以随项目演进，但修改必须是显式的项目规则变更并进入 Git。
- 普通开发任务不得为了方便而偷偷修改 Harness。
- 如果 Agent 判断规则需要调整，应先明确提出，并作为独立配置变更处理。
- Harness 不新增 Session Log、Task Log、Thinking Log 或 Agent Memory 数据源。
