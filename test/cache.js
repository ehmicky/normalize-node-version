import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import { setCacheFile, unsetCacheFile } from './helpers/cache.js'

// This uses a global environment variable to manipulate the cache file.
// Since this is global we:
//  - must use `test.serial()`
//  - must be done in a separate test file so it's in a different process than
//    the other tests
each(
  [
    { cacheFile: undefined, input: '4', output: '4.9.1' },
    { cacheFile: ['4.0.0', '1.2.3'], input: '1', output: '1.2.3' },
    { cacheFile: ['4.0.0', '1.2.3'], input: '4.0.0', output: '4.0.0' },
    { cacheFile: ['4.0.0', '1.2.3'], input: '4', output: '4.9.1' },
    { cacheFile: ['3.0.0', '1.2.3'], input: '4', output: '4.9.1' },
  ],
  ({ title }, { cacheFile, input, output }) => {
    test.serial(`Cached file | ${title}`, async t => {
      const cacheFileA = await setCacheFile(cacheFile)

      const version = await normalizeNodeVersion(input)

      t.is(version, output)

      await unsetCacheFile(cacheFileA, { cleanup: cacheFile !== undefined })
    })
  },
)
