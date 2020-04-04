import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

each([undefined, 'not_a_version_range', '50'], ({ title }, versionRange) => {
  test(`Invalid input | ${title}`, async (t) => {
    await t.throwsAsync(normalizeNodeVersion(versionRange))
  })
})

test('Invalid mirror', async (t) => {
  await t.throwsAsync(
    normalizeNodeVersion('4', { mirror: 'not_valid_url', cache: false }),
  )
})

test('Success', async (t) => {
  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')
})

test('Twice in same process', async (t) => {
  await normalizeNodeVersion('4')
  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')
})

each(['4.*', '<5'], ({ title }, versionRange) => {
  test(`Versions range | ${title}`, async (t) => {
    const version = await normalizeNodeVersion(versionRange)

    t.is(version, '4.9.1')
  })
})
