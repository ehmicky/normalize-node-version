import { readFile, writeFile } from 'fs'
import { promisify } from 'util'

import pathExists from 'path-exists'
import { clean as cleanRange, maxSatisfying, ltr } from 'semver'
import findCacheDir from 'find-cache-dir'
import cleanWrite from 'clean-write'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

const CACHE_DIR = findCacheDir({ name: 'normalize-node-version', create: true })
const VERSIONS_CACHE = `${CACHE_DIR}/versions.json`

// eslint-disable-next-line fp/no-let, init-declarations
let currentCachedVersions

// We cache the HTTP request. The cache needs to be invalidated sometimes since
// new Node versions are made available every week. We only invalidate it when
// the requested `versionRange` targets the latest Node version.
// The cache is persisted to
// `./node_modules/.cache/normalize-node-version/versions.json`.
// Also we also cache it in-memory so it's performed only once per process.
export const getCachedVersions = async function(versionRange) {
  if (currentCachedVersions !== undefined) {
    return currentCachedVersions
  }

  if (!(await pathExists(VERSIONS_CACHE))) {
    return
  }

  const versionsStr = await pReadFile(VERSIONS_CACHE, 'utf8')
  const versions = JSON.parse(versionsStr)

  if (isLatestVersion(versionRange, versions)) {
    return
  }

  return versions
}

// If latest is 12.8.0, `versionRange` `12.8` should invalid cache, but not
// `12.8.0`. `13` should also invalidate it.
const isLatestVersion = function(versionRange, versions) {
  const matchesLatest =
    cleanRange(versionRange) === null &&
    maxSatisfying(versions, versionRange) === versions[0]
  return matchesLatest || ltr(versions[0], versionRange)
}

// Persist the cached versions
export const cacheVersions = async function(versions) {
  const versionsStr = `${JSON.stringify(versions, null, 2)}\n`

  await cleanWrite(
    () => pWriteFile(VERSIONS_CACHE, versionsStr),
    VERSIONS_CACHE,
  )

  // eslint-disable-next-line fp/no-mutation
  currentCachedVersions = versions
}
