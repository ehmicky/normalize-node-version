import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import {
  setTestCache,
  unsetTestCache,
  writeCacheFile,
  removeCacheFile,
} from './helpers/cache.js'

// See `test/cache.js` for why tests are serial
each(
  [
    { versions: ['4.0.0'], input: '4', cache: true },
    { versions: ['4.0.0'], input: '4', cache: false },
  ],
  ({ title }, { versions, input, cache }) => {
    test.serial(`Offline | ${title}`, async (t) => {
      setTestCache()

      try {
        const cacheFile = await writeCacheFile(versions)

        const version = await normalizeNodeVersion(input)
        const offlineVersion = await normalizeNodeVersion(input, {
          cache,
          mirror: INVALID_MIRROR,
        })

        t.is(version, offlineVersion)

        await removeCacheFile(cacheFile, cache)
      } finally {
        unsetTestCache()
      }
    })
  },
)

test.serial(`Offline | no cache`, async (t) => {
  setTestCache()

  try {
    await t.throwsAsync(normalizeNodeVersion('4', { mirror: INVALID_MIRROR }))
  } finally {
    unsetTestCache()
  }
})

// Offline cache is used both when offline or when `mirror` is invalid.
// We only test the later case since it's simpler to test.
const INVALID_MIRROR = 'http://invalid-mirror.com'
