import { version as processVersion } from 'process'

import { validRange } from 'semver'

import { replaceAliases } from './alias.js'
import { getProjectVersion } from './project.js'

// `versionRange` can be one of the following aliases:
//   - `_`: current process's Node.js version
//   - `.`: current project's Node.js version using `.nvmrc`, etc.
export const resolveAlias = function (versionRange, opts) {
  const getVersion = ALIASES[versionRange]

  if (getVersion !== undefined) {
    return getVersion(opts)
  }

  if (!validRange(versionRange) && opts.nvmDir) {
    return replaceAliases(versionRange, opts)
  }

  return versionRange
}

const getCurrentVersion = function () {
  return processVersion
}

// List of available aliases
const ALIASES = {
  _: getCurrentVersion,
  '.': getProjectVersion,
}
