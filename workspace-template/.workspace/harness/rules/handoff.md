---
id: HARNESS-HANDOFF-V1
title: Handoff Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Handoff Rules

任何 Agent 都不得假设下一个 Agent 拥有当前 Chat、Memory、临时 Prompt 或私有上下文。

## 持久化交接

任务产生未来仍需知道的信息时，将结果写入合适的持久化项目资产：

- 实现状态 → Code / 项目资产
- 长期项目事实 → Workspace Knowledge
- 重要取舍 → ADR / Decision
- 阶段变化 → Release
- 文件历史与工作说明 → Git

## 完成检查

- 代码与交付资产已经保存并完成必要验证。
- 长期有效事实已按需更新，而不是记录所有工作过程。
- 重要决策与阶段变化进入各自事实来源。
- 后继 Agent 仅凭 Repository / Workspace 即可理解当前状态和下一步。

V1 不建立 Agent Session Log、Daily Log、Task History、Thinking Log 或 Agent 工作日记。Git、Knowledge、ADR 与 Release 已承担长期记录职责。
