import { env } from 'process'
import { writeFile, unlink } from 'fs'
import { promisify } from 'util'

import globalCacheDir from 'global-cache-dir'

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)

export const setCacheFile = async function(versions) {
  const cacheFilename = String(Math.random()).replace('.', '')
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CACHE_FILENAME = cacheFilename

  const cacheDir = await globalCacheDir('normalize-node-version')

  const cacheFile = `${cacheDir}/${cacheFilename}`

  if (versions !== undefined) {
    await pWriteFile(cacheFile, JSON.stringify(versions))
  }

  return cacheFile
}

export const unsetCacheFile = async function(
  cacheFile,
  { cleanup = true } = {},
) {
  if (cleanup) {
    await pUnlink(cacheFile)
  }

  // eslint-disable-next-line fp/no-delete
  delete env.TEST_CACHE_FILENAME
}
