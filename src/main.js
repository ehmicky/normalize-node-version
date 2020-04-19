import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { getOpts } from './options.js'

// Retrieve the Node version matching a specific `versionRange`
const normalizeNodeVersion = async function (versionRange, opts) {
  const { allNodeVersionsOpts } = getOpts(opts)
  const { versions } = await allNodeVersions(allNodeVersionsOpts)

  const version = maxSatisfying(versions, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = normalizeNodeVersion
