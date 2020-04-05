import { promises as fs } from 'fs'
import { version as processVersion } from 'process'

import { findNodeVersionFile } from './find.js'
import { isPackageJson, loadPackageJson } from './package.js'

// Use p-locate instead of find-up for performance (more parallelism)
export const getProjectVersion = async function ({ cwd }) {
  const nodeVersionFile = await findNodeVersionFile(cwd)

  if (nodeVersionFile === undefined) {
    return processVersion
  }

  const versionRange = loadNodeVersionFile(nodeVersionFile)
  return versionRange
}

const loadNodeVersionFile = async function (nodeVersionFile) {
  const content = await fs.readFile(nodeVersionFile, 'utf8')
  const contentA = content.trim()

  if (!isPackageJson(nodeVersionFile)) {
    return contentA
  }

  return loadPackageJson(contentA)
}
