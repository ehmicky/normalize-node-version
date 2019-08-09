import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import { setCacheFile, unsetCacheFile } from './helpers/cache.js'

each(['4.*', '<5'], ({ title }, versionRange) => {
  test(`Versions range | ${title}`, async t => {
    const version = await normalizeNodeVersion(versionRange)

    t.is(version, '4.9.1')
  })
})

each([undefined, 'not_a_version_range', '50'], ({ title }, versionRange) => {
  test(`Invalid input | ${title}`, async t => {
    await t.throwsAsync(normalizeNodeVersion(versionRange))
  })
})

test('Success', async t => {
  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')
})

test('Twice in the same process', async t => {
  await normalizeNodeVersion('4')
  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')
})

test.serial('Cached file', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('1')

  t.is(version, '1.2.3')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file but latest precise version', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4.0.0')

  t.is(version, '4.0.0')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file but latest version range', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file but above version range', async t => {
  const cacheFile = await setCacheFile(['3.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile)
})

test.serial('No cached file', async t => {
  const cacheFile = await setCacheFile()

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile, { cleanup: false })
})
