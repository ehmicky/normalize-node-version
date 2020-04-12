import pathExists from 'path-exists'

import {
  getCacheFile,
  getCacheFileContent,
  setCacheFileContent,
} from './file.js'

// We cache the HTTP request. It only lasts one hour (except offline)
// to make sure we include new Node versions made available every week.
// We also cache it in-memory so it's performed only once per process.
// If the `cache` option is:
//   - `undefined`: we use the cache
//   - `true`: we use the cache even if it is old
//   - `false`: we do not use the cache
// In all three cases, we update the cache on any successful HTTP request.
export const readCachedVersions = async function (cache) {
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
export const writeCachedVersions = async function (versions) {
  const cacheFile = await getCacheFile()
  await setCacheFileContent(cacheFile, versions)
}
