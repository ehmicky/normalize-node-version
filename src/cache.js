import { promises as fs } from 'fs'
import { env } from 'process'

import globalCacheDir from 'global-cache-dir'
import pathExists from 'path-exists'
import writeFileAtomic from 'write-file-atomic'

// We cache the HTTP request. It only lasts one hour (except offline)
// to make sure we include new Node versions made available every week.
// We also cache it in-memory so it's performed only once per process.
// If the `cache` option is:
//   - `undefined`: we use the cache
//   - `true`: we use the cache even if it is old
//   - `false`: we do not use the cache
// In all three cases, we update the cache on any successful HTTP request.
export const getCachedVersions = async function (cache) {
  if (cache === false) {
    return
  }

  const cacheFile = await getCacheFile()

  if (!(await pathExists(cacheFile))) {
    return
  }

  const { lastUpdate, versions } = getCacheFileContent(cacheFile)

  if (isOldCache(lastUpdate, cache)) {
    return
  }

  return versions
}

const isOldCache = function (lastUpdate, cache) {
  return Date.now() - lastUpdate > MAX_AGE_MS && cache !== true
}

// One hour
const MAX_AGE_MS = 36e5

// Persist the cached versions
export const saveCachedVersions = async function (versions) {
  const cacheFile = await getCacheFile()
  await setCacheFileContent(cacheFile, versions)
}

const getCacheFileContent = async function (cacheFile) {
  const cacheFileContent = await fs.readFile(cacheFile, 'utf8')
  const cacheContent = JSON.parse(cacheFileContent)
  return cacheContent
}

const setCacheFileContent = async function (cacheFile, versions) {
  const lastUpdate = Date.now()
  const cacheContent = { lastUpdate, versions }
  const cacheFileContent = `${JSON.stringify(cacheContent, null, 2)}\n`

  try {
    await writeFileAtomic(cacheFile, cacheFileContent)
    // If two different functions are calling `normalize-node-version` at the
    // same time and there's no cache file, they will both try to persist the
    // file and one might fail, especially on Windows (with EPERM lock file
    // errors)
  } catch {}
}

// The cache is persisted to `GLOBAL_CACHE_DIR/nve/versions.json`.
const getCacheFile = async function () {
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const cacheFilename = env.TEST_CACHE_FILENAME || CACHE_FILENAME
  return `${cacheDir}/${cacheFilename}`
}

const CACHE_DIR = 'nve'
const CACHE_FILENAME = 'versions.json'
