import { readFile } from 'fs'
import { promisify } from 'util'
import { env } from 'process'

import pathExists from 'path-exists'
import { clean, maxSatisfying, major } from 'semver'
import writeFileAtomic from 'write-file-atomic'
import globalCacheDir from 'global-cache-dir'

const pReadFile = promisify(readFile)

// We cache the HTTP request. The cache needs to be invalidated sometimes since
// new Node versions are made available every week. We only invalidate it when
// the requested `versionRange` targets the latest Node version.
// The cache is persisted to
// `GLOBAL_CACHE_DIR/normalize-node-version/versions.json`.
// Also we also cache it in-memory so it's performed only once per process.
export const getCachedVersions = async function(versionRange) {
  if (currentCachedVersions !== undefined && !env.TEST_CACHE_FILENAME) {
    return { cachedVersions: currentCachedVersions }
  }

  const cacheFile = await getCacheFile()
  const cachedVersions = await getCachedContent(cacheFile, versionRange)
  return { cachedVersions, cacheFile }
}

// eslint-disable-next-line fp/no-let, init-declarations
let currentCachedVersions

const getCacheFile = async function() {
  const cacheFilename = env.TEST_CACHE_FILENAME || CACHE_FILENAME
  const cacheDir = await globalCacheDir(CACHE_DIR)
  return `${cacheDir}/${cacheFilename}`
}

const CACHE_DIR = 'normalize-node-version'
const CACHE_FILENAME = 'versions.json'

const getCachedContent = async function(cacheFile, versionRange) {
  if (!(await pathExists(cacheFile))) {
    return
  }

  const versionsStr = await pReadFile(cacheFile, 'utf8')
  const versions = JSON.parse(versionsStr)

  if (!isCachedVersion(versionRange, versions)) {
    return
  }

  // eslint-disable-next-line fp/no-mutation
  currentCachedVersions = versions
  return versions
}

// We invalidate cache if:
//  - the version is missing
//  - the version is a range matching the last version of a major release.
//    E.g. `12` matches the last `12.*.*` but new versions might have been
//    released.
const isCachedVersion = function(versionRange, versions) {
  const version = maxSatisfying(versions, versionRange)
  const isMissing = version === null
  return (
    !isMissing && !(isRange(versionRange) && isLastVersion(version, versions))
  )
}

const isRange = function(versionRange) {
  return clean(versionRange) === null
}

const isLastVersion = function(version, versions) {
  const majorVersion = major(version)
  const maxVersion = versions.find(versionA => major(versionA) === majorVersion)
  return version === maxVersion
}

// Persist the cached versions
export const cacheVersions = async function(versions, cacheFile) {
  const versionsStr = `${JSON.stringify(versions, null, 2)}\n`

  try {
    await writeFileAtomic(cacheFile, versionsStr)
    // If two different functions are calling `normalize-node-version` at the
    // same time and there's no cache file, they will both try to persist the
    // file and one might fail, especially on Windows (with EPERM lock file
    // errors)
  } catch {}

  // eslint-disable-next-line fp/no-mutation
  currentCachedVersions = versions
}
