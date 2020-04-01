import { promises as fs } from 'fs'
import { version } from 'process'

import findUp from 'find-up'

export const NODE_VERSION_ALIAS = '.'
export const NODE_VERSION_FILES = ['.node-version', '.nvmrc', '.naverc']

export const CURRENT_NODE_ALIAS = '_'

export const resolveVersionRangeAlias = async function (
  versionRange,
  { cwd } = {},
) {
  if (versionRange === CURRENT_NODE_ALIAS) return version

  if (versionRange !== NODE_VERSION_ALIAS) return versionRange

  const nodeVersionFile = await findUp(NODE_VERSION_FILES, { cwd })

  if (nodeVersionFile === undefined) {
    throw new Error(
      `node config file not found [was looking for ${NODE_VERSION_FILES.join(
        ', ',
      )}]`,
    )
  }

  const nodeVersionFileContent = await fs.readFile(nodeVersionFile, 'utf-8')
  return nodeVersionFileContent.trim()
}
