import { promises as fs } from 'fs'
import { version as processVersion } from 'process'

import findUp from 'find-up'

export const NODE_VERSION_ALIAS = '.'
export const NODE_VERSION_FILES = ['.node-version', '.nvmrc', '.naverc']

export const CURRENT_NODE_ALIAS = '_'

export const resolveNodeVersionAlias = async ({ cwd } = {}) => {
  const nodeVersionFile = await findUp(NODE_VERSION_FILES, { cwd })
  if (nodeVersionFile === undefined) return

  const nodeVersionFileContent = await fs.readFile(nodeVersionFile, 'utf-8')
  return nodeVersionFileContent.trim()
}

export const resolveVersionRangeAlias = async function (
  versionRange,
  { cwd } = {},
) {
  if (versionRange === CURRENT_NODE_ALIAS) return processVersion

  if (versionRange === NODE_VERSION_ALIAS) {
    const resolvedVersion = await resolveNodeVersionAlias({ cwd })

    return resolvedVersion || processVersion
  }

  return versionRange
}
