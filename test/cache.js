import { promises as fs } from 'fs'

import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import {
  setTestCache,
  writeCacheFile,
  unsetTestCache,
} from './helpers/cache.js'
import { MAJOR_VERSION, LOW_VERSION, FULL_VERSION } from './helpers/versions.js'

test('Twice in same process', async (t) => {
  await normalizeNodeVersion(MAJOR_VERSION)
  const version = await normalizeNodeVersion(MAJOR_VERSION)

  t.is(version, FULL_VERSION)
})

// This uses a global environment variable to manipulate the cache file.
// Since this is global we:
//  - must use `test.serial()`
//  - must be done in a separate test file so it's in a different process than
//    the other tests
each(
  [
    // `cache: true`
    { result: true, option: true },
    // `cache` option default value
    { result: true },
    // `cache: false` option
    { result: false, option: false },
    // No cache file
    { result: false, option: true, noCacheFile: true },
    // Old cache file
    { result: false, option: true, oldCacheFile: true },
  ],
  (
    { title },
    { result, option, oldCacheFile = false, noCacheFile = false },
  ) => {
    test.serial(`Caching | ${title}`, async (t) => {
      setTestCache()

      try {
        const versions = noCacheFile ? undefined : [LOW_VERSION]
        const cacheFile = await writeCacheFile(versions, oldCacheFile)

        const version = await normalizeNodeVersion(MAJOR_VERSION, {
          cache: option,
        })

        const output = result ? LOW_VERSION : FULL_VERSION
        t.is(version, output)

        await fs.unlink(cacheFile)
      } finally {
        unsetTestCache()
      }
    })
  },
)
