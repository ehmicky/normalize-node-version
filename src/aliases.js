import { promises as fs } from 'fs'
import { version as processVersion } from 'process'

import findUp from 'find-up'

// `versionRange` can be one of the following aliases:
//   - `_`: current process's Node.js version
//   - `.`: current project's Node.js version using `.nvmrc`, etc.
export const resolveAlias = function (versionRange, opts) {
  const getVersion = ALIASES[versionRange]

  if (getVersion === undefined) {
    return versionRange
  }

  return getVersion(opts)
}

const getCurrentVersion = function () {
  return processVersion
}

const getProjectVersion = async function ({ cwd }) {
  const nodeVersionFile = await findUp(NODE_VERSION_FILES, { cwd })

  if (nodeVersionFile === undefined) {
    return processVersion
  }

  const content = await fs.readFile(nodeVersionFile, 'utf8')
  return content.trim()
}

const NODE_VERSION_FILES = ['.naverc', '.node-version', '.nvmrc']

// List of available aliases
const ALIASES = {
  _: getCurrentVersion,
  '.': getProjectVersion,
}
