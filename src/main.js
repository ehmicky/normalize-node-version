import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { resolveAlias } from './aliases.js'
import { getCachedVersions, cacheVersions } from './cache.js'
import { handleOfflineError } from './offline.js'
import { getOpts } from './options.js'

// Retrieve the Node version matching a specific `versionRange`
const normalizeNodeVersion = async function (versionRange, opts) {
  const { cwd, ...optsA } = getOpts(opts)
  const [versionRangeA, versions] = await Promise.all([
    resolveAlias(versionRange, { cwd }),
    getVersions(optsA),
  ])

  const version = maxSatisfying(versions, versionRangeA)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

// Retrieve all available Node versions
const getVersions = async function ({ cache, ...opts }) {
  if (!cache) {
    return getAllVersions(opts)
  }

  const { cachedVersions, cacheFile } = await getCachedVersions()

  if (cachedVersions !== undefined) {
    return cachedVersions
  }

  const versions = await getAllVersions(opts)

  await cacheVersions(versions, cacheFile)

  return versions
}

const getAllVersions = async function (opts) {
  try {
    return await allNodeVersions(opts)
  } catch (error) {
    return handleOfflineError(error)
  }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = normalizeNodeVersion
