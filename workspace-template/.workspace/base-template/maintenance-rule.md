---
id: RULE-BASE-TEMPLATE-MAINTENANCE-001
title: Base Template 维护规则
type: system-rule
domain: base-template
version: 1.1.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Base Template 维护规则

Base Template 的用户可感知功能发生新增、删除或调整时，必须同步检查并更新 Base Template Version、Registry、快速入门、功能介绍、当前限制、版本更新说明及必要迁移说明。

快速入门必须以真实代码和当前可操作页面为准，不能把规划能力写成已实现功能。旧版指南与版本记录不得被新版本覆盖或删除。

Harness Framework 的变更必须作为明确的模板规则升级处理，不得混入普通开发任务。Project Harness Rules 可以随项目演进，但必须显式修改并进入 Git 历史。
