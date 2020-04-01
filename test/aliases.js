import { join } from 'path'
import { version } from 'process'

import test from 'ava'

import { resolveVersionRangeAlias } from '../src/aliases.js'

const resolveInFolder = (versionRange, folder) =>
  resolveVersionRangeAlias(versionRange, {
    cwd: join(__dirname, 'fixtures', folder),
  })

test('Resolve - with node-version pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'node-version-project')
  t.is(versionRange, 'v12.12', 'nvmrc version not resolved')
})

test('Resolve - with nvmrc pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'nvmrc-project')
  t.is(versionRange, 'v12.14', 'nvmrc version not resolved')
})

test('Resolve - with nave pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'nave-project')
  t.is(versionRange, 'v12.16', '.nave version not resolved')
})

test('Resolve - in mixed project pseudo version, .node-version having precedence over .nvmrc', async (t) => {
  const versionRange = await resolveInFolder('.', 'mixed-project')
  t.is(versionRange, 'v12.12', 'not resolved to .node-version')
})

test('Throw error if resolving - and none of the node version files are found', async (t) => {
  await t.throwsAsync(
    resolveVersionRangeAlias('.', { cwd: join(__dirname, '..', 'src') }),
  )
})

test('Resolve current node pseudo version', async (t) => {
  const versionRange = await resolveVersionRangeAlias('_')

  t.is(versionRange, version, 'current version not resolved correctly')
})

test('Transfer node version that are not aliased [fully resolved]', async (t) => {
  const versionRange = await resolveVersionRangeAlias('v12.12.0')

  t.is(versionRange, 'v12.12.0', 'current version not resolved correctly')
})

test('Transfer node version that are not aliased [major version]', async (t) => {
  const versionRange = await resolveVersionRangeAlias('12')

  t.is(versionRange, '12', 'current version not resolved correctly')
})
