import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { getCachedVersions, cacheVersions } from './cache.js'

// Retrieve the Node version matching a specific `versionRange`
const normalizeNodeVersion = async function(versionRange) {
  const versions = await getVersions(versionRange)

  const version = maxSatisfying(versions, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

// Retrieve all available Node versions
const getVersions = async function(versionRange) {
  const cachedVersions = await getCachedVersions(versionRange)

  if (cachedVersions !== undefined) {
    return cachedVersions
  }

  const versions = await allNodeVersions()

  await cacheVersions(versions)

  return versions
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = normalizeNodeVersion
