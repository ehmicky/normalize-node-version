import { promises as fs } from 'fs'
import { env } from 'process'

import globalCacheDir from 'global-cache-dir'
import writeFileAtomic from 'write-file-atomic'

// We cache the HTTP request. It only lasts one hour (except offline)
// to make sure we include new Node versions made available every week.
// Also we also cache it in-memory so it's performed only once per process.
// If the `cache` option is `false`, we do not read/write cache.
export const getCachedVersions = async function (offline = false) {
  const cacheFile = await getCacheFile()
  const cacheStat = await getCacheStat(cacheFile)

  const cachedVersions = await retrieveCachedVersions(
    cacheFile,
    cacheStat,
    offline,
  )

  await updateCacheAtime(cachedVersions, cacheFile, cacheStat)

  return { cacheFile, cachedVersions }
}

// The cache is persisted to `GLOBAL_CACHE_DIR/nve/versions.json`.
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

const retrieveCachedVersions = async function (cacheFile, cacheStat, offline) {
  if (currentCachedVersions !== undefined && !env.TEST_CACHE_FILENAME) {
    return currentCachedVersions
  }

  const cachedVersions = await getCachedContent(cacheFile, cacheStat, offline)

  if (cachedVersions === undefined) {
    return
  }

  // eslint-disable-next-line fp/no-mutation, require-atomic-updates
  currentCachedVersions = cachedVersions

  return cachedVersions
}

// eslint-disable-next-line fp/no-let, init-declarations
let currentCachedVersions

// We invalidate the version every hour, except when offline
const getCachedContent = async function (cacheFile, cacheStat, offline) {
  if (cacheStat === undefined || shouldInvalidate(cacheStat, offline)) {
    return
  }

  const cacheContent = await fs.readFile(cacheFile, 'utf8')
  return JSON.parse(cacheContent)
}

const shouldInvalidate = function (cacheStat, offline) {
  return isOldCache(cacheStat) && !offline
}

const isOldCache = function ({ atimeMs }) {
  const ageMs = Date.now() - atimeMs
  return ageMs > MAX_AGE_MS
}

// One hour
const MAX_AGE_MS = 36e5

// When using the cache, refresh its atime so it bounces the cache duration
const updateCacheAtime = async function (cachedVersions, cacheFile, cacheStat) {
  if (cachedVersions === undefined || cacheStat === undefined) {
    return
  }

  const atime = Date.now() / MILLISECS_TO_SECS
  const mtime = cacheStat.mtimeMs / MILLISECS_TO_SECS
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
