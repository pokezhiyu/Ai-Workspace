import type { WorkspaceAgentProtocol } from '@/types/agents'

export const WORKSPACE_AGENT_PROTOCOL_PATH = '.workspace/agents/protocol.json'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Agent Protocol 缺少 ${field}`)
  return value.trim()
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`Agent Protocol 的 ${field} 格式无效`)
  }
  return value.map((item) => String(item).trim())
}

export function parseWorkspaceAgentProtocol(source: string): WorkspaceAgentProtocol {
  let raw: unknown
  try {
    raw = JSON.parse(source)
  } catch {
    throw new Error('Agent Protocol 不是有效 JSON')
  }
  if (!isRecord(raw)) throw new Error('Agent Protocol 根节点格式无效')
  if (!Array.isArray(raw.entryFlow) || !Array.isArray(raw.protocols)) {
    throw new Error('Agent Protocol 缺少入口流程或协议列表')
  }
  if (!isRecord(raw.contextStrategy) || !isRecord(raw.handoff) || !isRecord(raw.systemPolicy)) {
    throw new Error('Agent Protocol 缺少 Context、Handoff 或 System Policy')
  }

  const entryFlow = raw.entryFlow.map((value, index) => {
    if (!isRecord(value)) throw new Error(`Agent Protocol 入口 ${index + 1} 格式无效`)
    return {
      id: requiredString(value.id, `entryFlow[${index}].id`),
      label: requiredString(value.label, `entryFlow[${index}].label`),
      source: requiredString(value.source, `entryFlow[${index}].source`),
      purpose: requiredString(value.purpose, `entryFlow[${index}].purpose`),
    }
  })
  const protocols = raw.protocols.map((value, index) => {
    if (!isRecord(value)) throw new Error(`Agent Protocol 条目 ${index + 1} 格式无效`)
    return {
      id: requiredString(value.id, `protocols[${index}].id`),
      title: requiredString(value.title, `protocols[${index}].title`),
      summary: requiredString(value.summary, `protocols[${index}].summary`),
      rules: stringArray(value.rules, `protocols[${index}].rules`),
    }
  })

  return {
    schemaVersion: requiredString(raw.schemaVersion, 'schemaVersion'),
    id: requiredString(raw.id, 'id'),
    title: requiredString(raw.title, 'title'),
    version: requiredString(raw.version, 'version'),
    status: raw.status === 'system-readonly' ? raw.status : 'system-readonly',
    description: requiredString(raw.description, 'description'),
    sourceOfTruth: requiredString(raw.sourceOfTruth, 'sourceOfTruth'),
    entryFlow,
    contextStrategy: {
      name: requiredString(raw.contextStrategy.name, 'contextStrategy.name'),
      summary: requiredString(raw.contextStrategy.summary, 'contextStrategy.summary'),
      allowFullWorkspaceScan: raw.contextStrategy.allowFullWorkspaceScan === true,
    },
    protocols,
    handoff: {
      assumeSharedConversationHistory: raw.handoff.assumeSharedConversationHistory === true,
      durableTargets: stringArray(raw.handoff.durableTargets, 'handoff.durableTargets'),
      privateOnlyTargets: stringArray(raw.handoff.privateOnlyTargets, 'handoff.privateOnlyTargets'),
      completionChecks: stringArray(raw.handoff.completionChecks, 'handoff.completionChecks'),
    },
    systemPolicy: {
      mutableByRegularAgent: raw.systemPolicy.mutableByRegularAgent === true,
      humanUiMode: 'read-only',
      canDisable: raw.systemPolicy.canDisable === true,
      canDelete: raw.systemPolicy.canDelete === true,
      bootstrapPolicy: requiredString(raw.systemPolicy.bootstrapPolicy, 'systemPolicy.bootstrapPolicy'),
    },
  }
}
