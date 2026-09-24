---
id: HARNESS-WORK-V1
title: Work Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Work Rules

## 基本流程

理解任务 → 读取已有相关知识 → 检查当前 Role 与写入边界 → 检查已有 Enabled Skills → 执行任务 → 验证结果 → 更新必要的长期项目知识 → 留下可供后继者接手的结果。

这是一条最小工作主线，不要求普通开发任务机械地产生额外文档。

## 知识与决策

- 只有产生长期有效信息时才更新知识，遵循 [Knowledge Rules](knowledge.md)。
- ADR / Decision 只用于系统架构明显变化、重要技术选型、长期技术约束、重大业务规则变化、关键数据模型变化，或有长期影响的不可逆 / 高成本决策。
- 普通修改、小型修复、格式调整和临时实现过程不创建 ADR。
- 阶段变化按 [Release / History Rules](release.md) 更新，不把每次 Commit 当成 Release。

## Harness 维护

普通任务不得顺带修改 Harness。Harness 变更必须有明确目的、独立说明、必要验证并进入 Git 历史。
