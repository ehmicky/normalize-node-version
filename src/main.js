import allNodeVersions from 'all-node-versions'
import semver from 'semver'

import { getOpts } from './options.js'

// Retrieve the Node version matching a specific `versionRange`
export default async function normalizeNodeVersion(versionRange, opts) {
  const { allNodeVersionsOpts } = getOpts(opts)
  const { versions } = await allNodeVersions(allNodeVersionsOpts)

  const version = semver.maxSatisfying(versions, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}
