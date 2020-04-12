import { getProjectVersion } from './project.js'

// `versionRange` can be one of several aliases
export const resolveAlias = function (versionRange, opts) {
  const getVersion = ALIASES[versionRange]

  if (getVersion === undefined) {
    return versionRange
  }

  return getVersion(opts)
}

const getLatestVersion = function () {
  return '*'
}

// List of available aliases
const ALIASES = {
  current: getProjectVersion,
  // eslint-disable-next-line id-length
  c: getProjectVersion,
  latest: getLatestVersion,
  // eslint-disable-next-line id-length
  l: getLatestVersion,
}
