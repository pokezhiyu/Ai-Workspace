---
id: HARNESS-SKILLS-V1
title: Skill Rules
type: harness-rule
domain: workspace
version: 1.1.0
status: active
owner: engineering
updated: 2026-09-28
related:
  - HARNESS-WORKSPACE-V1
---

# Skill Rules

- Skill 是跟随 Workspace 的项目能力，不绑定某个 Agent 的私有环境。
- Agent 每次理解任务时都应读取 Skill Registry，并将任务需要的 Capability 与当前 Enabled Skills 主动匹配；用户不需要额外提醒 Agent 使用 Skill。
- 匹配到已启用且健康的 Skill 时，Agent 应在执行相关工作前主动读取其 `SKILL.md`，再按 Skill 工作流完成任务。
- 只使用已启用且健康检查通过的 Skill；disabled 或 invalid Skill 不使用。
- 用户在「Skill 配置」中的启用 / 禁用选择是默认使用决策；Agent 不得绕过禁用状态，重新扫描也不得自动恢复启用。
- 正式 Skill 的 Source of Truth 是项目内 `.workspace/skills/installed/{skill-id}/`。
- Agent 全局目录中的 Skill 只能作为导入候选，未导入 Workspace 前不是项目正式能力。

## 产品与设计任务的默认能力路由

Agent 处理产品构思、方案设计或界面交互任务时，应按任务实际需要组合 Registry 中的能力，而不是等待用户点名具体 Skill：

1. 使用 `product-design`、`prototype`、`design-system` 能力完成产品策略、信息架构、用户流程和原型规范。
2. 需要可继续编辑的草图、白板或用户旅程时，匹配 `editable-diagram`、`mindmap`、`flowchart`。
3. 需要正式规划图表时，匹配 `planning-diagram`、`gantt`、`quadrant`、`timeline`、`swimlane`、`state-diagram` 与 `svg`。
4. 需要展示页面视觉方向时，匹配 `frontend-design`、`ui-design`、`visual-design`。
5. 需要可点击、可切换页面或状态的功能演示时，匹配 `interactive-prototype`、`clickable-prototype`、`html-artifact` 与 `ui-flow`。
6. 交付前需要验证真实交互、截图或回归时，匹配 `browser-automation`、`ui-testing`。

只有任务确实需要对应能力时才调用；不为简单文字修改或无关任务机械加载全部 Skill。

Skill 列表、启用状态、健康状态与路径由 Skill System / Skill Registry 提供。Harness 不保存 Skill 清单，也不重新实现 Discovery 或 Registry。
