---
id: HARNESS-ACCESS-V1
title: Access Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Access Rules

- Workspace 专业知识全局可读。
- Human Active Role 对应的专业 Space 可写；Agent 继承 Human Active Roles。
- Agent 不得自行增加、删除或切换 Role，也不得因为读取了某个 Space 就获得写权限。
- 所有文档写入、创建、重命名、移动和删除必须经过现有 RoleAccessService / Workspace Guard。
- 跨 Space 移动同时检查来源与目标的写入权限，禁止绕过 Guard。
- `.workspace` 属于 System Layer，普通专业 Role 的写权限不等于可以修改系统配置。

真正权限判断由 Role System、RoleAccessService 与 Workspace Guard 负责。Harness 不维护 Role × Space 权限表，也不复制 Active Roles。
