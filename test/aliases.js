import { versions, cwd as getCwd, chdir } from 'process'

import test from 'ava'

import { resolveVersionRangeAlias } from '../src/aliases.js'
import normalizeNodeVersion from '../src/main.js'

const resolveInFolder = (versionRange, folder) =>
  normalizeNodeVersion(versionRange, {
    cwd: `${__dirname}/fixtures/${folder}`,
  })

test.serial('Option cwd defaults to the current directory', async (t) => {
  const currentCwd = getCwd()
  chdir(`${__dirname}/fixtures/nvmrc-project`)

  try {
    const versionRange = await normalizeNodeVersion('.')
    t.is(versionRange, '12.14.1')
  } finally {
    chdir(currentCwd)
  }
})

test('Resolve . with node-version pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'node-version-project')
  t.is(versionRange, '12.12.0')
})

test('Resolve . with nvmrc pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'nvmrc-project')
  t.is(versionRange, '12.14.1')
})

test('Resolve . with nave pseudo version', async (t) => {
  const versionRange = await resolveInFolder('.', 'nave-project')
  t.is(versionRange, '12.16.1')
})

test('Resolve . in mixed project pseudo version, .node-version having precedence over .nvmrc', async (t) => {
  const versionRange = await resolveInFolder('.', 'mixed-project')
  t.is(versionRange, '12.12.0')
})

test('Resolve . default to process.version if no version file found', async (t) => {
  const versionRange = await normalizeNodeVersion('.', {
    cwd: `${__dirname}/../src`,
  })
  t.is(versionRange, versions.node)
})

test('Resolve - current node pseudo version', async (t) => {
  const versionRange = await normalizeNodeVersion('_')

  t.is(versionRange, versions.node)
})

test('Transfer node version that are not aliased [fully resolved]', async (t) => {
  const versionRange = await resolveVersionRangeAlias('v12.12.0')

  t.is(versionRange, 'v12.12.0')
})

test('Transfer node version that are not aliased [major version]', async (t) => {
  const versionRange = await resolveVersionRangeAlias('12')

  t.is(versionRange, '12')
})
