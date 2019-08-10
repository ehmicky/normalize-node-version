import { env } from 'process'
import { writeFile, unlink } from 'fs'
import { promisify } from 'util'

import test from 'ava'
import { each } from 'test-each'
import globalCacheDir from 'global-cache-dir'

import normalizeNodeVersion from '../src/main.js'

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)

test.serial('No cached file', async t => {
  setCache()

  const cacheDir = await globalCacheDir('normalize-node-version')
  const cacheFile = `${cacheDir}/${env.TEST_CACHE_FILENAME}`

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await pUnlink(cacheFile)

  unsetCache()
})

// This uses a global environment variable to manipulate the cache file.
// Since this is global we:
//  - must use `test.serial()`
//  - must be done in a separate test file so it's in a different process than
//    the other tests
each(
  [
    // Non-last version -> cache
    { cache: ['4.0.0', '1.2.3'], input: '1', output: '1.2.3' },
    // Last version but no range -> cache
    { cache: ['4.0.0', '1.2.3'], input: '4.0.0', output: '4.0.0' },
    // Last version with range -> no cache
    { cache: ['4.0.0', '1.2.3'], input: '4', output: '4.9.1' },
    // Above last version -> no cache
    { cache: ['3.0.0', '1.2.3'], input: '4', output: '4.9.1' },
  ],
  ({ title }, { cache, input, output }) => {
    test.serial(`Cached file | ${title}`, async t => {
      setCache()

      const cacheDir = await globalCacheDir('normalize-node-version')
      const cacheFile = `${cacheDir}/${env.TEST_CACHE_FILENAME}`

      await pWriteFile(cacheFile, JSON.stringify(cache))

      const version = await normalizeNodeVersion(input)

      t.is(version, output)

      await pUnlink(cacheFile)

      unsetCache()
    })
  },
)

const setCache = function() {
  // eslint-disable-next-line fp/no-mutation
  env.TEST_CACHE_FILENAME = String(Math.random()).replace('.', '')
}

const unsetCache = function() {
  // eslint-disable-next-line fp/no-delete
  delete env.TEST_CACHE_FILENAME
}
