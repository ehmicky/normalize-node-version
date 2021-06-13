import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { getOpts } from './options.js'

// Retrieve the Node version matching a specific `versionRange`
// eslint-disable-next-line import/no-default-export
export default async function normalizeNodeVersion(versionRange, opts) {
  const { allNodeVersionsOpts } = getOpts(opts)
  const { versions } = await allNodeVersions(allNodeVersionsOpts)

  const version = maxSatisfying(versions, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}
