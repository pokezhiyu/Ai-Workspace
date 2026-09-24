export function normalizePath(path: string): string {
  return path.replaceAll('\\', '/').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/')
}

export function dirname(path: string): string {
  const normalized = normalizePath(path)
  const index = normalized.lastIndexOf('/')
  return index < 0 ? '' : normalized.slice(0, index)
}

export function basename(path: string): string {
  return normalizePath(path).split('/').at(-1) ?? ''
}

export function joinPath(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join('/'))
}

export function displayName(name: string): string {
  const normalized = name.replace(/\.md$/i, '').toLowerCase()
  const labels: Record<string, string> = {
    '.workspace': '.workspace', context: '上下文', rules: '规则', templates: '模板',
    'config.json': '配置', assets: '资源', docs: '文档', roles: '角色',
    '00-overview': '00 项目概览', '01-product': '01 产品', '02-design': '02 设计',
    '03-engineering': '03 工程', '04-decisions': '04 决策', '99-archive': '99 归档',
    'workspace-index': 'Workspace 索引', 'current-status': '当前状态', 'project-overview': '项目概览',
    'product-vision': '产品愿景', roadmap: '产品路线图', 'workspace-requirement': 'Workspace 需求',
    'workspace-user-flow': 'Workspace 用户流程', 'system-architecture': '系统架构',
    'frontend-architecture': '前端架构', 'document-rule': '文档规则', 'naming-rule': '命名规则',
    'version-rule': '版本规则', 'agent-context-rule': 'Agent 上下文规则',
    'product-design-rule': '产品设计与可视化规则', 'product-design': '产品设计模板',
    'product-design-guideline': '产品设计与可视化规范',
    'product-manager': '产品经理', designer: '设计师', 'frontend-engineer': '前端工程师',
    'backend-engineer': '后端工程师', 'qa-engineer': 'QA 工程师',
  }
  if (labels[normalized]) return labels[normalized]
  return name
    .replace(/\.md$/i, '')
    .replace(/^(\d{2})-/, '$1 ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function slugifyFileName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
