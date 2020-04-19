import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import { FULL_VERSION, RANGES } from './helpers/versions.js'

each(RANGES, ({ title }, versionRange) => {
  test(`Resolves versions range | ${title}`, async (t) => {
    const version = await normalizeNodeVersion(versionRange)
    t.is(version, FULL_VERSION)
  })
})
