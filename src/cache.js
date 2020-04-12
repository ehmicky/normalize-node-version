import { promises as fs } from 'fs'
import { env } from 'process'

import globalCacheDir from 'global-cache-dir'
import pathExists from 'path-exists'
import writeFileAtomic from 'write-file-atomic'

// We cache the HTTP request. It only lasts one hour (except offline)
// to make sure we include new Node versions made available every week.
// Also we also cache it in-memory so it's performed only once per process.
// If the `cache` option is `false`, we do not read/write cache.
export const getCachedVersions = async function (offline = false) {
  const cacheFile = await getCacheFile()

  if (!(await pathExists(cacheFile))) {
    return
  }

  const cacheContent = await fs.readFile(cacheFile, 'utf8')
  const { lastUpdate, versions } = JSON.parse(cacheContent)

  if (isOldCache(lastUpdate, offline)) {
    return
  }

  return versions
}

const isOldCache = function (lastUpdate, offline) {
  return Date.now() - lastUpdate > MAX_AGE_MS && !offline
}

// One hour
const MAX_AGE_MS = 36e5

// Persist the cached versions
export const saveCachedVersions = async function (versions) {
  const cacheFile = await getCacheFile()

  const cacheFileContent = getCacheFileContent(versions)
  const versionsStr = `${JSON.stringify(cacheFileContent, null, 2)}\n`

  try {
    await writeFileAtomic(cacheFile, versionsStr)
    // If two different functions are calling `normalize-node-version` at the
    // same time and there's no cache file, they will both try to persist the
    // file and one might fail, especially on Windows (with EPERM lock file
    // errors)
  } catch {}
}

const getCacheFileContent = function (versions) {
  const lastUpdate = Date.now()
  return { lastUpdate, versions }
}

// The cache is persisted to `GLOBAL_CACHE_DIR/nve/versions.json`.
const getCacheFile = async function () {
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const cacheFilename = env.TEST_CACHE_FILENAME || CACHE_FILENAME
  return `${cacheDir}/${cacheFilename}`
}

const CACHE_DIR = 'nve'
const CACHE_FILENAME = 'versions.json'
