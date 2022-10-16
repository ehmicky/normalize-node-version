import allNodeVersions from 'all-node-versions'
import semver from 'semver'

// Retrieve the Node version matching a specific `versionRange`
export default async function normalizeNodeVersion(versionRange, opts) {
  const { versions } = await allNodeVersions(opts)
  const versionsA = versions.map(getNodeVersion)

  const version = semver.maxSatisfying(versionsA, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

const getNodeVersion = function ({ node }) {
  return node
}
