# AI Coding Workspace

面向 Human 与 AI Agent 协作的本地 Markdown 项目知识空间。

它以文件、目录和 Git 为基础，将产品、设计、技术、测试与运维知识保存在同一个可阅读、可迁移、可持续维护的 Workspace 中。项目状态不依赖某个 Agent 的聊天记录，换电脑或更换 Coding Agent 后仍可从仓库继续工作。

当前版本为 **Base Template V1**。

## 主要功能

- 多层级项目知识目录，支持新建、重命名、复制、删除和拖拽移动
- Markdown 阅读与源码编辑，支持 Frontmatter、代码高亮、任务列表和表格
- Mermaid 流程图、时序图、状态图等文档图表
- 全文知识搜索、Heading 锚点、本页目录、Scroll Spy 和 Document Minimap
- 产品、设计、技术、测试、运维专业 Space
- Workspace Manifest、Harness 与跨 Agent 协作协议
- Role 与 Space 写入范围管理
- 项目内置 Skill 发现、启用、禁用、健康检查和安全删除
- Project Release 阶段与里程碑管理
- 面向普通用户的 GitHub 获取、修改查看、保存与上传流程
- Light、Dark、System 主题与可调整三栏布局

## 技术栈

- Vue 3 + TypeScript
- Vite
- Tailwind CSS
- Pinia + Vue Router
- markdown-it + gray-matter
- Mermaid
- Lucide Icons

## 环境要求

- Node.js 22.12 或更高版本
- npm
- Git（使用 GitHub 同步功能时需要）

## 本地启动

克隆项目：

```bash
git clone https://github.com/pokezhiyu/Ai-Workspace.git
cd Ai-Workspace
```

安装依赖：

```bash
npm ci
```

启动开发服务：

```bash
npm run dev
```

浏览器访问：

```text
http://localhost:5173
```

首次打开时，按页面提示填写项目名称和介绍，并选择当前工作角色。系统会生成稳定的 Workspace ID、项目首页、Project Harness 和初始 Release。

## 本地部署

构建生产版本：

```bash
npm run build
```

启动本地生产预览：

```bash
npm run preview -- --host 0.0.0.0
```

默认访问地址：

```text
http://localhost:4173
```

这种方式会保留当前 V1 的本地 Git 与 Workspace Skill 管理能力，适合个人电脑或可信的团队内网环境。

> Git 与 Skill 接口会操作运行机器上的项目文件。不要把完整本地服务直接暴露到不可信公网。

## 静态托管说明

`npm run build` 会生成 `dist/`，可以部署到常见静态托管平台或静态 Web Server。

纯静态部署可以使用 Markdown 阅读编辑、目录、搜索、主题等浏览器能力，但无法直接使用依赖本机文件系统的 Git 同步和 Skill 文件管理。当前 Base Template V1 不包含云端后端服务。

## 常用命令

```bash
# TypeScript 检查
npm run typecheck

# 生产构建
npm run build

# Clean Room 初始化状态检查
npm run test:clean-room

# Harness 规则检查
npm run test:harness

# Agent Protocol 检查
npm run test:agent-protocol

# Base Template 指南检查
npm run test:base-template
```

## 项目结构

```text
src/                Workspace 前端应用
server/             本地 Git 与 Skill 服务
scripts/            Base Template 与协议校验脚本
workspace-template/ Workspace Kernel、模板、Roles、Spaces 与 Skills
public/              公共静态资源
```

`workspace-template/.workspace/` 是系统层入口。普通项目知识通过 Workspace 界面维护，Agent 则从 Manifest、Agent Protocol 和 Harness 按需加载上下文。

## 数据与安全

- Token、密码和 Credential 不会写入 Workspace
- GitHub 身份认证使用当前系统已有的 Git Credential
- 正式 Skills 位于项目内部，可随 Git 一起迁移
- Workspace Registry 不保存用户目录或机器绝对路径
- 项目知识与 Git 历史是跨 Agent 交接的事实来源

## 当前边界

Base Template V1 以本地单人使用为主，不包含多人实时协作、云端数据库、Agent Runtime、RAG、Vector DB、知识图谱、Pull Request 管理或可视化 Git 冲突合并。

