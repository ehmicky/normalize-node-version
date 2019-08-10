import test from 'ava'

import normalizeNodeVersion from '../src/main.js'

import { setCacheFile, unsetCacheFile } from './helpers/cache.js'

test.serial('No cached file', async t => {
  const cacheFile = await setCacheFile()

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile, { cleanup: false })
})

test.serial('Cached file with non-latest version', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('1')

  t.is(version, '1.2.3')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file with latest precise version', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4.0.0')

  t.is(version, '4.0.0')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file with latest version range', async t => {
  const cacheFile = await setCacheFile(['4.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile)
})

test.serial('Cached file with above version range', async t => {
  const cacheFile = await setCacheFile(['3.0.0', '1.2.3'])

  const version = await normalizeNodeVersion('4')

  t.is(version, '4.9.1')

  await unsetCacheFile(cacheFile)
})
