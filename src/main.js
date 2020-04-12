import { env } from 'process'

import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { resolveAlias } from './aliases.js'
import { handleOfflineError } from './cache/offline.js'
import { readCachedVersions, writeCachedVersions } from './cache/read.js'
import { getOpts } from './options.js'

// Retrieve the Node version matching a specific `versionRange`
const normalizeNodeVersion = async function (versionRange, opts) {
  const { cwd, cache, ...optsA } = getOpts(opts)
  const [versionRangeA, versions] = await Promise.all([
    resolveAlias(versionRange, { cwd }),
    getAllVersions(cache, optsA),
  ])

  const version = maxSatisfying(versions, versionRangeA)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

// Retrieve all available Node versions
const getAllVersions = async function (cache, opts) {
  if (
    processCachedVersions !== undefined &&
    cache !== false &&
    !env.TEST_CACHE_FILENAME
  ) {
    return processCachedVersions
  }

  const versions = await getVersions(cache, opts)

  // eslint-disable-next-line fp/no-mutation, require-atomic-updates
  processCachedVersions = versions

  return versions
}

// eslint-disable-next-line fp/no-let, init-declarations
let processCachedVersions

const getVersions = async function (cache, opts) {
  const cachedVersions = await readCachedVersions(cache)

  if (cachedVersions !== undefined) {
    return cachedVersions
  }

  try {
    const versions = await allNodeVersions(opts)
    await writeCachedVersions(versions)
    return versions
  } catch (error) {
    return handleOfflineError(error)
  }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = normalizeNodeVersion
