---
id: HARNESS-CONTEXT-V1
title: Context Loading
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Context Loading

采用 **Progressive Context Loading**：先读取稳定入口和索引，再按任务需要逐步加载内容，禁止默认一次性读取整个 Workspace。

## 加载顺序

1. 读取 Workspace Manifest，识别项目身份与模块入口。
2. 读取唯一 Agent Protocol，确认所有 Agent 共同遵守的系统协议。
3. 读取 Harness README 与本次任务适用的规则。
4. 从 Role System 读取 Human Active Roles。
5. 从 Release System 读取 Current Release 与当期摘要。
6. 从 Skill System 读取 Enabled Skills。
7. 读取 `.workspace/context/workspace-index.md`，确定目标 Space 与稳定知识入口。
8. 读取当前任务相关的有效文档，并按 Related Documents 补充上下文。
9. 只有调查历史原因时，才继续读取 ADR、历史 Release 或 Git History。

## 约束

- Archived 默认不读取；Superseded 仅在调查历史原因时读取。
- 跨 Space 读取必须围绕当前任务，不进行无目的全量扫描。
- Current Role、Release 与 Skill 必须读取运行时真实状态，不得从 Harness 推断。
