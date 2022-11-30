import test from 'ava'
import normalizeNodeVersion from 'normalize-node-version'
import { each } from 'test-each'

import { FULL_VERSION, RANGES } from './helpers/versions.test.js'

each(RANGES, ({ title }, versionRange) => {
  test(`Resolves versions range | ${title}`, async (t) => {
    const version = await normalizeNodeVersion(versionRange)
    t.is(version, FULL_VERSION)
  })
})
