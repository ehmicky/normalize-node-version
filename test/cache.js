import { env } from 'process'
import { writeFile, unlink } from 'fs'
import { promisify } from 'util'

import test from 'ava'
import { each } from 'test-each'
import globalCacheDir from 'global-cache-dir'

import normalizeNodeVersion from '../src/main.js'

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)

// This uses a global environment variable to manipulate the cache file.
// Since this is global we:
//  - must use `test.serial()`
//  - must be done in a separate test file so it's in a different process than
//    the other tests
each(
  [
    { cache: undefined, input: '4', output: '4.9.1' },
    { cache: ['4.0.0', '1.2.3'], input: '1', output: '1.2.3' },
    { cache: ['4.0.0', '1.2.3'], input: '4.0.0', output: '4.0.0' },
    { cache: ['4.0.0', '1.2.3'], input: '4', output: '4.9.1' },
    { cache: ['3.0.0', '1.2.3'], input: '4', output: '4.9.1' },
  ],
  ({ title }, { cache, input, output }) => {
    test.serial(`Cached file | ${title}`, async t => {
      const cacheFile = await setCacheFile(cache)

      const version = await normalizeNodeVersion(input)

      t.is(version, output)

      if (cacheFile !== undefined) {
        await pUnlink(cacheFile)
      }

      // eslint-disable-next-line fp/no-delete
      delete env.TEST_CACHE_FILENAME
    })
  },
)

const setCacheFile = async function(versions) {
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
