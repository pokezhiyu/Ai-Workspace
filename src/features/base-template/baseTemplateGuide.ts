import type {
  BaseTemplateGuide,
  BaseTemplateRegistry,
  BaseTemplateVersionRecord,
  BaseTemplateVersionStatus,
} from '@/types/baseTemplate'

export const BASE_TEMPLATE_REGISTRY_PATH = '.workspace/base-template/registry.json'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`Base Template Guide 缺少 ${field}`)
  return value
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Base Template Guide 缺少 ${field}`)
  return value.trim()
}

function requiredStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`Base Template Guide 的 ${field} 格式无效`)
  }
  return value.map((item) => String(item).trim())
}

function versionStatus(value: unknown): BaseTemplateVersionStatus {
  return value === 'supported' || value === 'deprecated' ? value : 'current'
}

function parseVersion(value: unknown, index: number): BaseTemplateVersionRecord {
  const entry = requiredRecord(value, `versions[${index}]`)
  return {
    id: requiredString(entry.id, `versions[${index}].id`),
    name: requiredString(entry.name, `versions[${index}].name`),
    version: requiredString(entry.version, `versions[${index}].version`),
    status: versionStatus(entry.status),
    releasedAt: requiredString(entry.releasedAt, `versions[${index}].releasedAt`),
    guidePath: requiredString(entry.guidePath, `versions[${index}].guidePath`),
    summary: requiredString(entry.summary, `versions[${index}].summary`),
  }
}

export function parseBaseTemplateRegistry(source: string): BaseTemplateRegistry {
  let raw: unknown
  try {
    raw = JSON.parse(source)
  } catch {
    throw new Error('Base Template Registry 不是有效 JSON')
  }
  const root = requiredRecord(raw, 'root')
  if (!Array.isArray(root.versions)) throw new Error('Base Template Registry 缺少 versions')
  const versions = root.versions.map(parseVersion)
  const current = requiredString(root.current, 'current')
  if (!versions.some((version) => version.id === current)) throw new Error('Base Template Registry 的 current 无法匹配版本记录')
  return {
    schemaVersion: requiredString(root.schemaVersion, 'schemaVersion'),
    id: requiredString(root.id, 'id'),
    sourceRepository: requiredString(root.sourceRepository, 'sourceRepository'),
    current,
    versions,
  }
}

export function parseBaseTemplateGuide(source: string): BaseTemplateGuide {
  let raw: unknown
  try {
    raw = JSON.parse(source)
  } catch {
    throw new Error('快速入门不是有效 JSON')
  }
  const root = requiredRecord(raw, 'root')
  const harness = requiredRecord(root.harness, 'harness')
  const collaboration = requiredRecord(root.collaboration, 'collaboration')
  if (!Array.isArray(root.glossary) || !Array.isArray(root.modules)) {
    throw new Error('快速入门缺少术语或模块说明')
  }

  return {
    schemaVersion: requiredString(root.schemaVersion, 'schemaVersion'),
    id: requiredString(root.id, 'id'),
    templateVersion: requiredString(root.templateVersion, 'templateVersion'),
    productName: requiredString(root.productName, 'productName'),
    title: requiredString(root.title, 'title'),
    description: requiredString(root.description, 'description'),
    introduction: requiredStringArray(root.introduction, 'introduction'),
    glossary: root.glossary.map((value, index) => {
      const item = requiredRecord(value, `glossary[${index}]`)
      return {
        term: requiredString(item.term, `glossary[${index}].term`),
        plainName: requiredString(item.plainName, `glossary[${index}].plainName`),
        description: requiredString(item.description, `glossary[${index}].description`),
      }
    }),
    modules: root.modules.map((value, index) => {
      const item = requiredRecord(value, `modules[${index}]`)
      return {
        id: requiredString(item.id, `modules[${index}].id`),
        title: requiredString(item.title, `modules[${index}].title`),
        canDo: requiredString(item.canDo, `modules[${index}].canDo`),
        howToUse: requiredString(item.howToUse, `modules[${index}].howToUse`),
      }
    }),
    firstRunSteps: requiredStringArray(root.firstRunSteps, 'firstRunSteps'),
    harness: {
      title: requiredString(harness.title, 'harness.title'),
      paragraphs: requiredStringArray(harness.paragraphs, 'harness.paragraphs'),
      agentFlow: requiredStringArray(harness.agentFlow, 'harness.agentFlow'),
    },
    collaboration: {
      title: requiredString(collaboration.title, 'collaboration.title'),
      description: requiredString(collaboration.description, 'collaboration.description'),
      handoffRule: requiredString(collaboration.handoffRule, 'collaboration.handoffRule'),
    },
    extensions: requiredStringArray(root.extensions, 'extensions'),
    limitations: requiredStringArray(root.limitations, 'limitations'),
  }
}
