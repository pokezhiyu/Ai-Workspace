---
id: HARNESS-SKILLS-V1
title: Skill Rules
type: harness-rule
domain: workspace
version: 1.0.0
status: active
owner: engineering
updated: 2026-09-24
related:
  - HARNESS-WORKSPACE-V1
---

# Skill Rules

- Skill 是跟随 Workspace 的项目能力，不绑定某个 Agent 的私有环境。
- 任务需要额外能力时，优先读取 Skill Registry 并匹配当前 Enabled Skills。
- 只使用已启用且健康检查通过的 Skill；disabled 或 invalid Skill 不使用。
- 使用 Skill 前读取 Registry 指向的 `SKILL.md`，并遵守其触发条件、工作流与安全要求。
- 正式 Skill 的 Source of Truth 是项目内 `.workspace/skills/installed/{skill-id}/`。
- Agent 全局目录中的 Skill 只能作为导入候选，未导入 Workspace 前不是项目正式能力。

Skill 列表、启用状态、健康状态与路径由 Skill System / Skill Registry 提供。Harness 不保存 Skill 清单，也不重新实现 Discovery 或 Registry。
