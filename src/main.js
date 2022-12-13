import allNodeVersions from 'all-node-versions'
import semver from 'semver'

// Retrieve the Node version matching a specific `versionRange`
const normalizeNodeVersion = async (versionRange, opts) => {
  const { versions } = await allNodeVersions(opts)
  const versionsA = versions.map(getNodeVersion)

  const version = semver.maxSatisfying(versionsA, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

export default normalizeNodeVersion

const getNodeVersion = ({ node }) => node
