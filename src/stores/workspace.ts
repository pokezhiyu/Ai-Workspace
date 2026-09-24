import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { LocalStorageWorkspaceAdapter, RoleGuardedWorkspaceFileAdapter } from '@/adapters/workspace-file'
import type {
  SearchIndexItem,
  SearchResult,
  SaveState,
  WorkspaceDocument,
  WorkspaceEntry,
  WorkspaceManifestIdentity,
  WorkspaceSpaceDefinition,
  WorkspaceTreeNode,
  TreeDropPosition,
} from '@/types/workspace'
import type { CreateProjectReleaseInput } from '@/types/releases'
import { createDocumentSource, parseDocument, validateDocumentSource } from '@/utils/document'
import { basename, dirname, displayName, joinPath, slugifyFileName } from '@/utils/path'
import { buildWorkspaceSearchIndex, searchWorkspaceIndex } from '@/features/search/workspaceSearchIndex'
import { useDocumentToc } from '@/composables/useDocumentToc'
import { parseWorkspaceConfig } from '@/features/workspace/workspaceConfig'
import {
  parseWorkspaceManifest,
  serializeWorkspaceManifest,
  WORKSPACE_MANIFEST_PATH,
} from '@/features/workspace/workspaceManifest'
import { WorkspaceInitializationService } from '@/features/workspace/WorkspaceInitializationService'
import {
  isWorkspaceSystemPath,
  projectKnowledgeEntries as filterProjectKnowledgeEntries,
} from '@/features/workspace/workspaceSystemPaths'
import { WorkspaceReleaseService } from '@/features/releases/WorkspaceReleaseService'
import {
  EMPTY_RELEASE_REGISTRY,
  parseProjectReleaseRegistry,
  RELEASE_REGISTRY_PATH,
} from '@/features/releases/workspaceReleaseRegistry'
import { RoleAccessService } from '@/features/roles/RoleAccessService'
import { HumanRoleSettingsService } from '@/features/roles/HumanRoleSettingsService'
import type { WorkspaceSkillImportCandidate } from '@/types/skills'
import { parseWorkspaceAgentProtocol, WORKSPACE_AGENT_PROTOCOL_PATH } from '@/features/agents/workspaceAgentProtocol'
import { parseBaseTemplateGuide, parseBaseTemplateRegistry } from '@/features/base-template/baseTemplateGuide'
import { WorkspaceSkillRegistryService } from '@/features/skills/WorkspaceSkillRegistryService'
import {
  getEnabledSkills as selectEnabledSkills,
  parseWorkspaceSkillRegistry,
  WORKSPACE_SKILL_REGISTRY_PATH,
} from '@/features/skills/workspaceSkillRegistry'

const systemAdapter = new LocalStorageWorkspaceAdapter()
const roleAccessService = new RoleAccessService(systemAdapter)
const humanRoleSettingsService = new HumanRoleSettingsService(systemAdapter, roleAccessService)
const adapter = new RoleGuardedWorkspaceFileAdapter(systemAdapter, roleAccessService)
const releaseService = new WorkspaceReleaseService(systemAdapter)
const skillRegistryService = new WorkspaceSkillRegistryService(systemAdapter)
const workspaceInitializationService = new WorkspaceInitializationService(systemAdapter)
const SIDEBAR_WIDTH_KEY = 'ai-coding-workspace:sidebar-width'
const DEFAULT_SIDEBAR_WIDTH = 264
const MIN_SIDEBAR_WIDTH = 220
const MAX_SIDEBAR_WIDTH = 360

function loadSidebarWidth(): number {
  const rawValue = window.localStorage.getItem(SIDEBAR_WIDTH_KEY)
  if (rawValue === null) return DEFAULT_SIDEBAR_WIDTH
  const stored = Number(rawValue)
  if (!Number.isFinite(stored)) return DEFAULT_SIDEBAR_WIDTH
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, stored))
}

function treeSort(a: WorkspaceTreeNode, b: WorkspaceTreeNode): number {
  const orderDelta = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
  if (orderDelta !== 0) return orderDelta
  if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
}

function toTree(entries: WorkspaceEntry[], spaces: WorkspaceSpaceDefinition[]): WorkspaceTreeNode[] {
  const spacesByPath = new Map(spaces.map((space) => [space.path, space]))
  const nodes = new Map<string, WorkspaceTreeNode>()
  for (const entry of entries) {
    const space = spacesByPath.get(entry.path)
    nodes.set(entry.path, {
      ...entry,
      children: [],
      ...(space ? { order: space.order, space } : {}),
    })
  }
  const roots: WorkspaceTreeNode[] = []
  for (const node of nodes.values()) {
    const parent = nodes.get(dirname(node.path))
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  const sortRecursively = (items: WorkspaceTreeNode[]): void => {
    items.sort(treeSort)
    for (const item of items) sortRecursively(item.children)
  }
  sortRecursively(roots)
  return roots
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const entries = ref<WorkspaceEntry[]>([])
  const activeDocument = ref<WorkspaceDocument | null>(null)
  const activePath = ref('')
  const editorSource = ref('')
  const saveState = ref<SaveState>('idle')
  const loading = ref(true)
  const expandedFolders = ref(new Set(['开始阅读', '开始阅读/项目入口']))
  const contextCollapsed = ref(false)
  const sidebarCollapsed = ref(false)
  const sidebarWidth = ref(loadSidebarWidth())
  const searchIndex = ref<SearchIndexItem[]>([])
  const activeHeadingId = ref('')
  const anchorRequest = ref<{ id: string; nonce: number } | null>(null)
  const tocBody = ref('')
  const releaseRegistry = ref({ ...EMPTY_RELEASE_REGISTRY })
  const externalSkillCandidates = ref<WorkspaceSkillImportCandidate[]>([])
  const { headings: tocHeadings } = useDocumentToc(tocBody)
  let tocTimer: number | undefined

  const workspaceConfig = computed(() => {
    const configEntry = entries.value.find((entry) => entry.path === '.workspace/config.json' && entry.kind === 'file')
    return parseWorkspaceConfig(configEntry?.content ?? '')
  })
  const workspaceManifest = computed(() => {
    const manifestEntry = entries.value.find((entry) => entry.path === WORKSPACE_MANIFEST_PATH && entry.kind === 'file')
    return parseWorkspaceManifest(manifestEntry?.content ?? '')
  })
  const agentProtocolState = computed(() => {
    const entry = entries.value.find((candidate) => candidate.path === WORKSPACE_AGENT_PROTOCOL_PATH && candidate.kind === 'file')
    if (!entry?.content) return { protocol: null, error: '未找到 Workspace Agent Protocol。' }
    try {
      return { protocol: parseWorkspaceAgentProtocol(entry.content), error: '' }
    } catch (error) {
      return {
        protocol: null,
        error: error instanceof Error ? error.message : 'Agent Protocol 解析失败。',
      }
    }
  })
  const agentProtocol = computed(() => agentProtocolState.value.protocol)
  const agentProtocolError = computed(() => agentProtocolState.value.error)
  const baseTemplateState = computed(() => {
    const registryPath = workspaceManifest.value.entrypoints.baseTemplate
    const registryEntry = entries.value.find((candidate) => candidate.path === registryPath && candidate.kind === 'file')
    if (!registryEntry?.content) return { registry: null, currentVersion: null, guide: null, error: '未找到 Base Template Registry。' }
    try {
      const registry = parseBaseTemplateRegistry(registryEntry.content)
      const currentVersion = registry.versions.find((version) => version.id === registry.current) ?? null
      if (!currentVersion) return { registry, currentVersion: null, guide: null, error: '未找到当前 Base Template 版本。' }
      const guideEntry = entries.value.find((candidate) => candidate.path === currentVersion.guidePath && candidate.kind === 'file')
      if (!guideEntry?.content) return { registry, currentVersion, guide: null, error: '未找到当前 Base Template 快速入门。' }
      return { registry, currentVersion, guide: parseBaseTemplateGuide(guideEntry.content), error: '' }
    } catch (error) {
      return {
        registry: null,
        currentVersion: null,
        guide: null,
        error: error instanceof Error ? error.message : 'Base Template 快速入门解析失败。',
      }
    }
  })
  const baseTemplateRegistry = computed(() => baseTemplateState.value.registry)
  const currentBaseTemplateVersion = computed(() => baseTemplateState.value.currentVersion)
  const baseTemplateGuide = computed(() => baseTemplateState.value.guide)
  const baseTemplateError = computed(() => baseTemplateState.value.error)
  const spaces = computed(() => workspaceConfig.value.spaces)
  const roles = computed(() => roleAccessService.getRoles(entries.value))
  const activeRoleIds = computed(() => roleAccessService.getActiveRoleIds(entries.value))
  const writableSpaceIds = computed(() => roleAccessService.getWritableSpaceIds(entries.value))
  const roleAccessContext = computed(() => roleAccessService.getAccessContext(entries.value))
  const skillRegistry = computed(() => {
    const entry = entries.value.find((candidate) => candidate.path === WORKSPACE_SKILL_REGISTRY_PATH && candidate.kind === 'file')
    if (!entry?.content) return null
    try {
      return parseWorkspaceSkillRegistry(entry.content)
    } catch {
      return null
    }
  })
  const enabledSkills = computed(() => skillRegistry.value ? selectEnabledSkills(skillRegistry.value) : [])
  const projectName = computed(() => workspaceManifest.value.workspace.name)
  const projectDescription = computed(() => workspaceManifest.value.workspace.description)
  const needsWorkspaceInitialization = computed(() => !workspaceManifest.value.workspace.name.trim())
  const workspaceIdentityLocked = computed(() => Boolean(
    workspaceManifest.value.workspace.name.trim() && workspaceManifest.value.workspace.id.trim(),
  ))
  const projectKnowledgeEntries = computed(() => filterProjectKnowledgeEntries(entries.value))
  const tree = computed(() => toTree(projectKnowledgeEntries.value, spaces.value))
  const documents = computed(() => entries.value.filter((entry) => entry.kind === 'file' && entry.path.endsWith('.md')))
  const hasUnsavedChanges = computed(() => saveState.value === 'unsaved')
  const currentRelease = computed(() => releaseRegistry.value.releases.find(
    (release) => release.id === releaseRegistry.value.current,
  ) ?? null)
  const projectHomePath = computed(() => workspaceConfig.value.defaultDocument)
  const isWorkspaceInitialized = computed(() => Boolean(
    entries.value.some((entry) => entry.path === WORKSPACE_MANIFEST_PATH && entry.kind === 'file')
    && entries.value.some((entry) => entry.path === projectHomePath.value && entry.kind === 'file')
    && !needsWorkspaceInitialization.value,
  ))

  async function initialize(requestedPath?: string): Promise<void> {
    loading.value = true
    try {
      await refresh()
      if (needsWorkspaceInitialization.value) {
        activePath.value = ''
        activeDocument.value = null
        editorSource.value = ''
        tocBody.value = ''
        return
      }
      const configuredDefault = workspaceConfig.value.defaultDocument
      const fallback = await adapter.exists(configuredDefault)
        ? configuredDefault
        : await adapter.exists('.workspace/context/workspace-index.md')
          ? '.workspace/context/workspace-index.md'
          : ''
      const path = requestedPath && (await adapter.exists(requestedPath)) ? requestedPath : fallback
      if (path) await openDocument(path)
    } finally {
      loading.value = false
    }
  }

  async function refresh(): Promise<void> {
    entries.value = await adapter.list()
    searchIndex.value = buildWorkspaceSearchIndex(entries.value)
    const releaseEntry = entries.value.find((entry) => entry.path === RELEASE_REGISTRY_PATH && entry.kind === 'file')
    releaseRegistry.value = parseProjectReleaseRegistry(releaseEntry?.content ?? '')
  }

  async function createProjectRelease(input: CreateProjectReleaseInput): Promise<void> {
    await releaseService.create(input)
    await refresh()
  }

  async function activateProjectRelease(id: string): Promise<void> {
    await releaseService.activate(id)
    await refresh()
  }

  async function publishProjectRelease(id: string, releasedAt: string): Promise<void> {
    await releaseService.release(id, releasedAt)
    await refresh()
  }

  async function replaceWorkspaceSnapshot(snapshot: WorkspaceEntry[]): Promise<void> {
    const previous = new Map(entries.value.map((entry) => [entry.path, entry]))
    const merged = snapshot.map((entry) => {
      const existing = previous.get(entry.path)
      return {
        ...entry,
        order: existing?.order,
        createdAt: existing?.createdAt ?? entry.createdAt,
      }
    })
    await adapter.replaceAll(merged)
    await refresh()
    if (activePath.value && entries.value.some((entry) => entry.path === activePath.value && entry.kind === 'file')) {
      await openDocument(activePath.value)
    }
  }

  async function openDocument(path: string): Promise<void> {
    const source = await adapter.read(path)
    activePath.value = path
    activeDocument.value = parseDocument(path, source)
    editorSource.value = source
    tocBody.value = activeDocument.value.body
    saveState.value = 'idle'
    activeHeadingId.value = ''
    expandAncestors(path)
  }

  function setEditorSource(source: string): void {
    editorSource.value = source
    saveState.value = source === activeDocument.value?.source ? 'idle' : 'unsaved'
    window.clearTimeout(tocTimer)
    tocTimer = window.setTimeout(() => {
      tocBody.value = parseDocument(activePath.value, source).body
    }, 300)
  }

  async function saveDocument(): Promise<void> {
    if (!activePath.value || !activeDocument.value) return
    saveState.value = 'saving'
    try {
      validateDocumentSource(editorSource.value)
      await adapter.write(activePath.value, editorSource.value)
      activeDocument.value = parseDocument(activePath.value, editorSource.value)
      tocBody.value = activeDocument.value.body
      await refresh()
      saveState.value = 'saved'
      window.setTimeout(() => {
        if (saveState.value === 'saved') saveState.value = 'idle'
      }, 1800)
    } catch (error) {
      saveState.value = 'error'
      throw error
    }
  }

  async function updateWorkspaceIdentity(identity: WorkspaceManifestIdentity): Promise<void> {
    const currentIdentity = workspaceManifest.value.workspace
    const nextId = workspaceIdentityLocked.value ? currentIdentity.id : identity.id.trim()
    const nextManifest = {
      ...workspaceManifest.value,
      workspace: { ...identity, id: nextId },
    }
    await systemAdapter.write(WORKSPACE_MANIFEST_PATH, serializeWorkspaceManifest(nextManifest))
    await refresh()
  }

  async function completeWorkspaceInitialization(
    input: Omit<WorkspaceManifestIdentity, 'id'>,
    requestedRoleIds: string[] = [],
  ): Promise<string> {
    if (!needsWorkspaceInitialization.value) return projectHomePath.value
    const availableRoleIds = new Set(roles.value.filter((role) => role.status === 'active').map((role) => role.id))
    const activeRoleIds = [...new Set(requestedRoleIds)].filter((id) => availableRoleIds.has(id))
    const result = await workspaceInitializationService.initialize(workspaceManifest.value, input, activeRoleIds)
    await refresh()
    await openDocument(result.homePath)
    return result.homePath
  }

  async function setActiveRoles(roleIds: string[]): Promise<void> {
    await humanRoleSettingsService.setActiveRoles(roleIds, 'human-settings')
    await refresh()
  }

  async function rescanSkills(): Promise<void> {
    const result = await skillRegistryService.rescan()
    externalSkillCandidates.value = result.externalCandidates
    await refresh()
  }

  async function importSkill(id: string): Promise<void> {
    const result = await skillRegistryService.import(id)
    externalSkillCandidates.value = result.externalCandidates
    await refresh()
  }

  async function setSkillEnabled(id: string, enabled: boolean): Promise<void> {
    await skillRegistryService.setEnabled(id, enabled)
    await refresh()
  }

  async function deleteSkill(id: string): Promise<{ removedFiles: boolean }> {
    const result = await skillRegistryService.remove(id)
    await refresh()
    return { removedFiles: result.removedFiles }
  }

  async function getEnabledWorkspaceSkills() {
    return skillRegistryService.getEnabledSkills()
  }

  function canReadPath(path: string): boolean {
    return roleAccessService.canReadPath(path)
  }

  function canWritePath(path: string): boolean {
    return roleAccessService.canWritePath(path, entries.value)
  }

  async function validateChangedFiles(paths: string[]) {
    return roleAccessService.validateChangedFiles(paths)
  }

  function toggleFolder(path: string): void {
    const next = new Set(expandedFolders.value)
    if (next.has(path)) next.delete(path)
    else next.add(path)
    expandedFolders.value = next
  }

  function expandAncestors(path: string): void {
    const next = new Set(expandedFolders.value)
    let parent = dirname(path)
    while (parent) {
      next.add(parent)
      parent = dirname(parent)
    }
    expandedFolders.value = next
  }

  function isHarnessPath(path: string): boolean {
    return isWorkspaceSystemPath(path)
  }

  function isSpacePath(path: string): boolean {
    return spaces.value.some((space) => space.path === path)
  }

  function orderedSiblings(folderPath: string, excludePath?: string): WorkspaceEntry[] {
    return entries.value
      .filter((entry) => dirname(entry.path) === folderPath && entry.path !== excludePath)
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || treeSort({ ...a, children: [] }, { ...b, children: [] }))
  }

  function remapExpandedPaths(previousPath: string, nextPath: string): void {
    const next = new Set<string>()
    for (const path of expandedFolders.value) {
      if (path === previousPath || path.startsWith(`${previousPath}/`)) next.add(nextPath + path.slice(previousPath.length))
      else next.add(path)
    }
    expandedFolders.value = next
  }

  async function moveEntryToFolder(path: string, destinationFolder: string, beforePath?: string): Promise<string> {
    if (isHarnessPath(path) || isHarnessPath(destinationFolder)) throw new Error('.workspace Harness 结构不可移动')
    const previousActivePath = activePath.value
    const nextPath = await adapter.move(path, destinationFolder, beforePath ? { beforePath } : undefined)
    remapExpandedPaths(path, nextPath)
    await refresh()
    expandAncestors(nextPath)
    if (previousActivePath === path || previousActivePath.startsWith(`${path}/`)) {
      await openDocument(nextPath + previousActivePath.slice(path.length))
    }
    return nextPath
  }

  async function moveEntry(path: string, targetPath: string | null, position: TreeDropPosition): Promise<string> {
    if (position === 'root') return moveEntryToFolder(path, '')
    if (!targetPath) throw new Error('缺少移动目标')
    const target = entries.value.find((entry) => entry.path === targetPath)
    if (!target) throw new Error('移动目标不存在')
    if (isHarnessPath(targetPath)) throw new Error('.workspace Harness 结构不可作为移动目标')
    if (position === 'inside') {
      if (target.kind !== 'folder') throw new Error('文档不能包含其他项目')
      return moveEntryToFolder(path, target.path)
    }
    const destinationFolder = dirname(target.path)
    const siblings = orderedSiblings(destinationFolder, path)
    const targetIndex = siblings.findIndex((entry) => entry.path === target.path)
    if (targetIndex < 0) throw new Error('无法确定目标排序位置')
    const insertionIndex = position === 'before' ? targetIndex : targetIndex + 1
    return moveEntryToFolder(path, destinationFolder, siblings[insertionIndex]?.path)
  }

  async function moveEntryByOffset(path: string, offset: -1 | 1): Promise<string> {
    const folderPath = dirname(path)
    const siblings = orderedSiblings(folderPath)
    const index = siblings.findIndex((entry) => entry.path === path)
    const target = siblings[index + offset]
    if (!target) throw new Error(offset < 0 ? '已经位于最上方' : '已经位于最下方')
    return moveEntry(path, target.path, offset < 0 ? 'before' : 'after')
  }

  async function moveEntryToParent(path: string): Promise<string> {
    const parent = dirname(path)
    if (!parent) throw new Error('该项目已经位于 Workspace 根目录')
    return moveEntryToFolder(path, dirname(parent))
  }

  async function createDocument(folderPath: string, title: string): Promise<string> {
    const slug = slugifyFileName(title) || 'untitled'
    let path = joinPath(folderPath, `${slug}.md`)
    let suffix = 2
    while (await adapter.exists(path)) path = joinPath(folderPath, `${slug}-${suffix++}.md`)
    const id = `DOC-${Date.now().toString(36).toUpperCase()}`
    await adapter.createFile(path, createDocumentSource(title || 'Untitled', id))
    await refresh()
    expandAncestors(path)
    await openDocument(path)
    return path
  }

  async function createFolder(parentPath: string, name: string): Promise<string> {
    const safeName = slugifyFileName(name) || 'untitled-folder'
    let path = joinPath(parentPath, safeName)
    let suffix = 2
    while (await adapter.exists(path)) path = joinPath(parentPath, `${safeName}-${suffix++}`)
    await adapter.createFolder(path)
    await refresh()
    expandAncestors(path)
    const next = new Set(expandedFolders.value)
    next.add(path)
    expandedFolders.value = next
    return path
  }

  async function renameEntry(path: string, rawName: string): Promise<string> {
    const entry = entries.value.find((candidate) => candidate.path === path)
    if (!entry) throw new Error('未找到该项目')
    const requestedName = rawName.trim()
    if (!requestedName) throw new Error('名称不能为空')
    const forbiddenNames = ['final', 'new', 'latest', '最新版', '最终版']
    if (forbiddenNames.some((word) => requestedName.toLowerCase().includes(word))) {
      throw new Error('名称应表达稳定语义，不能包含版本状态')
    }
    const baseName = requestedName.replace(/\.md$/i, '')
    let name = slugifyFileName(baseName)
    if (!name) throw new Error('名称必须包含可读字符')
    if (entry.kind === 'file' && path.endsWith('.md')) name += '.md'
    const nextPath = await adapter.rename(path, name)
    if (activePath.value === path || activePath.value.startsWith(`${path}/`)) {
      const nextActivePath = nextPath + activePath.value.slice(path.length)
      await openDocument(nextActivePath)
    }
    await refresh()
    return nextPath
  }

  async function deleteEntry(path: string): Promise<void> {
    const deletesActive = activePath.value === path || activePath.value.startsWith(`${path}/`)
    await adapter.delete(path)
    await refresh()
    if (deletesActive) {
      const next = documents.value[0]
      if (next) await openDocument(next.path)
      else {
        activePath.value = ''
        activeDocument.value = null
      }
    }
  }

  async function duplicateDocument(path: string): Promise<string> {
    const source = await adapter.read(path)
    const folder = dirname(path)
    const stem = basename(path).replace(/\.md$/i, '')
    let copyPath = joinPath(folder, `${stem}-copy.md`)
    let suffix = 2
    while (await adapter.exists(copyPath)) copyPath = joinPath(folder, `${stem}-copy-${suffix++}.md`)
    await adapter.createFile(copyPath, source)
    await refresh()
    return copyPath
  }

  function search(query: string): SearchResult[] {
    return searchWorkspaceIndex(searchIndex.value, query)
  }

  function navigateToHeading(id: string): void {
    activeHeadingId.value = id
    anchorRequest.value = { id, nonce: Date.now() }
  }

  function setSidebarWidth(width: number): void {
    sidebarWidth.value = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, Math.round(width)))
  }

  function persistSidebarWidth(width = sidebarWidth.value): void {
    setSidebarWidth(width)
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth.value))
  }

  function findPathByDocumentId(id: string): string | undefined {
    return documents.value.find((entry) => parseDocument(entry.path, entry.content ?? '').metadata.id === id)?.path
  }

  function titleForPath(path: string): string {
    const entry = entries.value.find((candidate) => candidate.path === path)
    return entry?.kind === 'file' ? parseDocument(path, entry.content ?? '').metadata.title : displayName(basename(path))
  }

  return {
    entries,
    projectKnowledgeEntries,
    workspaceConfig,
    workspaceManifest,
    agentProtocol,
    agentProtocolError,
    baseTemplateRegistry,
    currentBaseTemplateVersion,
    baseTemplateGuide,
    baseTemplateError,
    releaseRegistry,
    currentRelease,
    spaces,
    roles,
    activeRoleIds,
    writableSpaceIds,
    roleAccessContext,
    skillRegistry,
    enabledSkills,
    externalSkillCandidates,
    projectName,
    projectDescription,
    needsWorkspaceInitialization,
    workspaceIdentityLocked,
    projectHomePath,
    isWorkspaceInitialized,
    tree,
    documents,
    activeDocument,
    activePath,
    editorSource,
    saveState,
    loading,
    expandedFolders,
    hasUnsavedChanges,
    contextCollapsed,
    sidebarCollapsed,
    sidebarWidth,
    searchIndex,
    activeHeadingId,
    anchorRequest,
    tocBody,
    tocHeadings,
    initialize,
    refresh,
    createProjectRelease,
    activateProjectRelease,
    publishProjectRelease,
    replaceWorkspaceSnapshot,
    openDocument,
    setEditorSource,
    saveDocument,
    updateWorkspaceIdentity,
    completeWorkspaceInitialization,
    setActiveRoles,
    rescanSkills,
    importSkill,
    setSkillEnabled,
    deleteSkill,
    getEnabledWorkspaceSkills,
    canReadPath,
    canWritePath,
    validateChangedFiles,
    toggleFolder,
    expandAncestors,
    isHarnessPath,
    isSpacePath,
    createDocument,
    createFolder,
    renameEntry,
    deleteEntry,
    duplicateDocument,
    moveEntry,
    moveEntryToFolder,
    moveEntryByOffset,
    moveEntryToParent,
    search,
    setSidebarWidth,
    persistSidebarWidth,
    navigateToHeading,
    findPathByDocumentId,
    titleForPath,
  }
})
