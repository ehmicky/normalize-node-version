import { promises as fs } from 'fs'
import { env } from 'process'

import globalCacheDir from 'global-cache-dir'
import { clean, maxSatisfying, major } from 'semver'
import writeFileAtomic from 'write-file-atomic'

// We cache the HTTP request. The cache needs to be invalidated sometimes since
// new Node versions are made available every week. We only invalidate it when
// the requested `versionRange` targets the latest Node version.
// The cache is persisted to
// `GLOBAL_CACHE_DIR/normalize-node-version/versions.json`.
// Also we also cache it in-memory so it's performed only once per process.
// If the `cache` option is `false` (default), we do not read/write cache.
export const getCachedVersions = async function (versionRange) {
  if (currentCachedVersions !== undefined && !env.TEST_CACHE_FILENAME) {
    return { cachedVersions: currentCachedVersions }
  }

  const cacheFile = await getCacheFile()
  const cacheStat = await getCacheStat(cacheFile)
  const cachedVersions = await getCachedContent(
    cacheFile,
    cacheStat,
    versionRange,
  )

  if (cachedVersions !== undefined) {
    return { cachedVersions }
  }

  return { cacheFile }
}

// eslint-disable-next-line fp/no-let, init-declarations
let currentCachedVersions

const getCacheFile = async function () {
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const cacheFilename = env.TEST_CACHE_FILENAME || CACHE_FILENAME
  return `${cacheDir}/${cacheFilename}`
}

const CACHE_DIR = 'nve'
const CACHE_FILENAME = 'versions.json'

const getCacheStat = async function (cacheFile) {
  try {
    return await fs.stat(cacheFile)
  } catch {}
}

const getCachedContent = async function (cacheFile, cacheStat, versionRange) {
  if (cacheStat === undefined) {
    return
  }

  const versions = JSON.parse(await fs.readFile(cacheFile, 'utf8'))

  if (versionRange === undefined) {
    return versions
  }

  if (!isCachedVersion(versionRange, versions, cacheStat)) {
    return
  }

  await updateCacheAtime(cacheFile, cacheStat)

  // eslint-disable-next-line fp/no-mutation
  currentCachedVersions = versions

  return versions
}

// We invalidate cache if:
//  - the version is missing
//  - the version is a range matching the last version of a major release.
//    E.g. `12` matches the last `12.*.*` but new versions might have been
//    released. This is cached for one hour, which is refreshed on each access.
const isCachedVersion = function (versionRange, versions, cacheStat) {
  const version = maxSatisfying(versions, versionRange)
  const isMissing = version === null
  return (
    !isMissing &&
    !(
      isRange(versionRange) &&
      isLastVersion(version, versions) &&
      isOldCache(cacheStat)
    )
  )
}

const isRange = function (versionRange) {
  return clean(versionRange) === null
}

const isLastVersion = function (version, versions) {
  const majorVersion = major(version)
  const maxVersion = versions.find(
    (versionA) => major(versionA) === majorVersion,
  )
  return version === maxVersion
}

const isOldCache = function ({ atimeMs }) {
  const ageMs = Date.now() - atimeMs
  return ageMs > MAX_AGE_MS
}

// One hour
const MAX_AGE_MS = 36e5

// Refresh cache file atime so it bounces the cache duration
const updateCacheAtime = async function (cacheFile, { mtimeMs }) {
  const atime = Date.now() / MILLISECS_TO_SECS
  const mtime = mtimeMs / MILLISECS_TO_SECS
  await fs.utimes(cacheFile, atime, mtime)
}

const MILLISECS_TO_SECS = 1e3

// Persist the cached versions
export const cacheVersions = async function (versions, cacheFile) {
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
