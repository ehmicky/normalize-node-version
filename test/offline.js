import { promises as fs } from 'fs'

import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import {
  setTestCache,
  unsetTestCache,
  writeCacheFile,
} from './helpers/cache.js'
import { MAJOR_VERSION, LOW_VERSION } from './helpers/versions.js'

// See `test/cache.js` for why tests are serial
each([true, false], ({ title }, cache) => {
  test.serial(`Offline | ${title}`, async (t) => {
    setTestCache()

    try {
      const cacheFile = await writeCacheFile([LOW_VERSION])

      const version = await normalizeNodeVersion(MAJOR_VERSION)
      const offlineVersion = await normalizeNodeVersion(MAJOR_VERSION, {
        cache,
        mirror: INVALID_MIRROR,
      })

      t.is(version, offlineVersion)

      await fs.unlink(cacheFile)
    } finally {
      unsetTestCache()
    }
  })
})

test.serial(`Offline | no cache`, async (t) => {
  setTestCache()

  try {
    await t.throwsAsync(
      normalizeNodeVersion(MAJOR_VERSION, { mirror: INVALID_MIRROR }),
    )
  } finally {
    unsetTestCache()
  }
})

// Offline cache is used both when offline or when `mirror` is invalid.
// We only test the later case since it's simpler to test.
const INVALID_MIRROR = 'http://invalid-mirror.com'
