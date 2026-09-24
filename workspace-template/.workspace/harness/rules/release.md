---
id: HARNESS-RELEASE-V1
title: Release / History Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Release / History Rules

- 从 Release Registry 读取 Current Release，理解项目当前阶段与目标。
- Release 表达项目演进阶段，不是知识隔离边界；当前有效知识始终在对应 Workspace 文档中累计维护。
- 不为 V1、V2、V3 复制整套 Workspace，也不以版本号创建平行知识目录。
- Release Summary 记录阶段目标、背景、重要变化与完成情况，不复制产品、设计、技术或测试文档。
- 历史状态通过 Git、Tag、ADR / Decision 与历史 Release Summary 按需获取。
- 普通 Commit 属于当前阶段的工作过程；Push 不自动创建 Release。
- 重要长期决策使用 Decision / ADR，文件级历史由 Git 保存。

Current Release 的真实状态由 Release System 提供。Harness 不保存当前 Release ID、状态或阶段清单。
