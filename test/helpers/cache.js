import { promises as fs } from 'fs'
import { env } from 'process'

import globalCacheDir from 'global-cache-dir'

// We set an environment variable with mocked cached versions to be able to
// test caching.
export const setTestCache = function () {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CACHE_FILENAME = String(Math.random()).replace('.', '')
}

export const unsetTestCache = function () {
  // eslint-disable-next-line fp/no-delete
  delete env.TEST_CACHE_FILENAME
}

export const writeCacheFile = async function (versions, old) {
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const cacheFile = `${cacheDir}/${env.TEST_CACHE_FILENAME}`

  if (versions !== undefined) {
    await fs.writeFile(cacheFile, JSON.stringify(versions))
  }

  if (old) {
    await fs.utimes(cacheFile, 0, 0)
  }

  return cacheFile
}

const CACHE_DIR = 'normalize-node-version'
