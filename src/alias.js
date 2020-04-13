import { promises as fs } from 'fs'

import { validRange, rsort } from 'semver'

const NODE_LATEST_ALIASES = new Set(['stable', 'node', 'latest'])
const NODE_LTS_CODE_NAMES = new Set([
  'argon',
  'boron',
  'carbon',
  'dubnium',
  'erbium',
  'fermium',
  'gallium',
  'hydrogen',
  'iron',
])

const resolveNvmLatestNode = async ({ nvmDir }) => {
  const nodeVersions = await fs.readdir(`${nvmDir}/versions/node`)
  return rsort(nodeVersions)[0]
}

const getAliasedVersion = async ({ nvmDir, alias }) => {
  const aliasWithImplicitLts = NODE_LTS_CODE_NAMES.has(alias)
    ? `lts/${alias}`
    : alias
  const aliasPath = `${nvmDir}/alias/${aliasWithImplicitLts}`

  await fs.stat(aliasPath).catch((error) => {
    if (error.code === 'ENOENT') {
      throw new Error(`alias ${alias} does not exist`)
    }

    throw error
  })
  const content = await fs.readFile(aliasPath, 'utf-8')
  return content.trim()
}

const resolveNvmAlias = async (
  alias,
  { nvmDir, previousAliases = [] } = {},
) => {
  if (NODE_LATEST_ALIASES.has(alias)) {
    return resolveNvmLatestNode({ nvmDir })
  }

  if (previousAliases.includes(alias)) {
    throw new Error(
      `Nvm alias cycle detected ${previousAliases.join(' -> ')} -> ${alias}`,
    )
  }

  const resolvedVersion = await getAliasedVersion({ nvmDir, alias })

  if (validRange(resolvedVersion)) {
    return resolvedVersion
  }

  return resolveNvmAlias(resolvedVersion, {
    nvmDir,
    previousAliases: [...previousAliases, alias],
  })
}

// nvm allows several aliases like `lts/*`
export const replaceAliases = function (versionRange, { nvmDir } = {}) {
  if (nvmDir) {
    return resolveNvmAlias(versionRange, { nvmDir })
  }

  const aliasedVersionRange = ALIASES[versionRange]

  if (aliasedVersionRange === undefined) {
    return versionRange
  }

  return aliasedVersionRange
}

const ALIASES = {
  node: '*',
  stable: '*',
  unstable: '0.11',
}
