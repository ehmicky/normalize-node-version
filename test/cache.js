import { env } from 'process'
import { writeFile, unlink, utimes } from 'fs'
import { promisify } from 'util'

import test from 'ava'
import { each } from 'test-each'
import globalCacheDir from 'global-cache-dir'

import normalizeNodeVersion from '../src/main.js'

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)
const pUtimes = promisify(utimes)

// This uses a global environment variable to manipulate the cache file.
// Since this is global we:
//  - must use `test.serial()`
//  - must be done in a separate test file so it's in a different process than
//    the other tests
each(
  [
    // No cache
    { versions: undefined, input: '4', output: '4.9.1', cache: true },
    // `cache: false` option
    { versions: ['4.0.0', '1.2.3'], input: '4', output: '4.9.1', cache: false },
    // `cache` option default value
    { versions: ['4.0.0', '1.2.3'], input: '4', output: '4.0.0' },
    // Non-last version -> cache
    {
      versions: ['4.0.0', '1.2.3', '1.1.3'],
      input: '1.1',
      output: '1.1.3',
      cache: true,
    },
    // Last version but no range -> cache
    {
      versions: ['4.0.0', '1.2.3'],
      input: '4.0.0',
      output: '4.0.0',
      cache: true,
    },
    // Last version with range -> cache if recent cache file
    { versions: ['4.0.0', '1.2.3'], input: '4', output: '4.0.0', cache: true },
    // Last version with range -> no cache if old cache file
    {
      versions: ['4.0.0', '1.2.3'],
      input: '4',
      output: '4.9.1',
      old: true,
      cache: true,
    },
    // Above last version -> no cache
    { versions: ['3.0.0', '1.2.3'], input: '4', output: '4.9.1', cache: true },
  ],
  ({ title }, { versions, input, output, old, cache }) => {
    test.serial(`Caching | ${title}`, async t => {
      // eslint-disable-next-line fp/no-mutation
      env.TEST_CACHE_FILENAME = String(Math.random()).replace('.', '')

      const cacheFile = await writeCacheFile(versions, old)

      const version = await normalizeNodeVersion(input, { cache })

      t.is(version, output)

      if (cache) {
        await pUnlink(cacheFile)
      }

      // eslint-disable-next-line fp/no-delete
      delete env.TEST_CACHE_FILENAME
    })
  },
)

const writeCacheFile = async function(versions, old) {
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
