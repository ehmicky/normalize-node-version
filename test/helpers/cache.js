import { env } from 'process'
import { writeFile, unlink, utimes } from 'fs'
import { promisify } from 'util'

import globalCacheDir from 'global-cache-dir'

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)
const pUtimes = promisify(utimes)

// We set an environment variable with mocked cached versions to be able to
// test caching.
export const setTestCache = function() {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CACHE_FILENAME = String(Math.random()).replace('.', '')
}

export const unsetTestCache = function() {
  // eslint-disable-next-line fp/no-delete
  delete env.TEST_CACHE_FILENAME
}

export const writeCacheFile = async function(versions, old) {
  const cacheDir = await globalCacheDir('normalize-node-version')
  const cacheFile = `${cacheDir}/${env.TEST_CACHE_FILENAME}`

  if (versions !== undefined) {
    await pWriteFile(cacheFile, JSON.stringify(versions))
  }

  if (old) {
    await pUtimes(cacheFile, 0, 0)
  }

  return cacheFile
}

export const removeCacheFile = async function(cacheFile, cache) {
  if (!cache) {
    return
  }

  await pUnlink(cacheFile)
}
