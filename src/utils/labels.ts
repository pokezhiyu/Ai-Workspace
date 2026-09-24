import type { DocumentStatus } from '@/types/workspace'

const statusLabels: Record<DocumentStatus, string> = {
  draft: '草稿',
  review: '审核中',
  active: '当前有效',
  superseded: '已被替代',
  archived: '已归档',
}

const typeLabels: Record<string, string> = {
  document: '文档', note: '笔记', requirement: '需求', architecture: '架构',
  decision: '决策', rule: '规则', role: '角色', overview: '概览', roadmap: '路线图',
  status: '状态', flow: '流程', vision: '愿景', index: '索引', template: '模板',
}

export function documentStatusLabel(status?: DocumentStatus): string {
  return status ? statusLabels[status] : statusLabels.draft
}

export function documentTypeLabel(type?: string): string {
  if (!type) return '文档'
  return typeLabels[type.toLowerCase()] ?? type
}
