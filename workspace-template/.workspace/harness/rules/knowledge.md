---
id: HARNESS-KNOWLEDGE-V1
title: Knowledge Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Knowledge Rules

## 文档原则

- 优先更新已有文档；主题未改变时，不创建平行或重复文档。
- 文件名只表达稳定语义，禁止使用 `final`、`new`、`latest`、`最新版`、`最终版`、`final2` 或版本号表达状态。
- Markdown 文档使用 Frontmatter，至少维护稳定 `id`、`title`、`type`、`domain`、`version`、`status`、`owner` 与 `updated`。
- 文档状态使用 `draft`、`review`、`active`、`superseded`、`archived`；默认优先读取当前有效知识。
- 语义版本保存在 Metadata；历史版本由 Git 保存。重要变化原因通过 ADR / Decision 或 Release Summary 解释。

## Space 语义

- `product` → 产品空间
- `design` → 设计空间
- `engineering` → 技术空间
- `quality` → 测试空间
- `operations` → 运维空间

内容写入主要负责该事实的专业 Space；跨专业关联使用 Related Documents，不复制全文。

## 更新触发

只有当任务产生未来 Human 或 Agent 仍然需要知道的信息时，才更新 Workspace Knowledge，例如新业务规则、架构变化、API 约定、长期设计原则、测试策略、部署方式或长期约束。

小型代码修复、格式调整、临时调试过程和一次性实现细节通常不写入知识文档。Workspace 不是 Agent 工作日志。
