export type BaseTemplateVersionStatus = 'current' | 'supported' | 'deprecated'

export interface BaseTemplateVersionRecord {
  id: string
  name: string
  version: string
  status: BaseTemplateVersionStatus
  releasedAt: string
  guidePath: string
  summary: string
}

export interface BaseTemplateRegistry {
  schemaVersion: string
  id: string
  sourceRepository: string
  current: string
  versions: BaseTemplateVersionRecord[]
}

export interface BaseTemplateGuideTerm {
  term: string
  plainName: string
  description: string
}

export interface BaseTemplateGuideModule {
  id: string
  title: string
  canDo: string
  howToUse: string
}

export interface BaseTemplateGuide {
  schemaVersion: string
  id: string
  templateVersion: string
  productName: string
  title: string
  description: string
  introduction: string[]
  glossary: BaseTemplateGuideTerm[]
  modules: BaseTemplateGuideModule[]
  firstRunSteps: string[]
  harness: {
    title: string
    paragraphs: string[]
    agentFlow: string[]
  }
  collaboration: {
    title: string
    description: string
    handoffRule: string
  }
  extensions: string[]
  limitations: string[]
}
