import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import { MAJOR_VERSION, FULL_VERSION, RANGES } from './helpers/versions.js'

test('Success', async (t) => {
  const version = await normalizeNodeVersion(MAJOR_VERSION)

  t.is(version, FULL_VERSION)
})

test('Twice in same process', async (t) => {
  await normalizeNodeVersion(MAJOR_VERSION)
  const version = await normalizeNodeVersion(MAJOR_VERSION)

  t.is(version, FULL_VERSION)
})

each(RANGES, ({ title }, versionRange) => {
  test(`Versions range | ${title}`, async (t) => {
    const version = await normalizeNodeVersion(versionRange)

    t.is(version, FULL_VERSION)
  })
})
