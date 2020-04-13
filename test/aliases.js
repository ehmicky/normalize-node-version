import { versions, cwd as getCwd, chdir } from 'process'

import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

const FIXTURES_DIR = `${__dirname}/fixtures`

// We use old Node.js versions to ensure new ones are not published, making
// those tests fail
const VERSIONS = {
  nave: '4.1.2',
  nvmrc: '4.2.6',
  nodeVersion: '4.3.2',
  current: versions.node,
  NVM: {
    carbon: '8.17.0',
    node: '12.16.2',
    personal: '12.12.0',
    default: '10.10.0',
  },
}

const NVM_OPTS = { nvmDir: `${FIXTURES_DIR}/nvm-dir` }

each(
  [
    { versionRange: '.', fixture: 'naverc', result: VERSIONS.nave },
    {
      versionRange: '.',
      fixture: 'node-version',
      result: VERSIONS.nodeVersion,
    },
    { versionRange: '.', fixture: 'nvmrc', result: VERSIONS.nvmrc },
    { versionRange: '.', fixture: 'mixed', result: VERSIONS.nodeVersion },
    { versionRange: '.', opts: { cwd: '/' }, result: VERSIONS.current },
    { versionRange: '_', result: VERSIONS.current },
    { versionRange: 'node', opts: NVM_OPTS, result: VERSIONS.NVM.node },
    { versionRange: 'stable', opts: NVM_OPTS, result: VERSIONS.NVM.node },
    { versionRange: 'latest', opts: NVM_OPTS, result: VERSIONS.NVM.node },
    { versionRange: 'default', opts: NVM_OPTS, result: VERSIONS.NVM.default },
    {
      versionRange: 'personal-alias',
      opts: NVM_OPTS,
      result: VERSIONS.NVM.personal,
    },
    { versionRange: 'lts/carbon', opts: NVM_OPTS, result: VERSIONS.NVM.carbon },
    // implicit lts prefix for lts node codenames
    { versionRange: 'carbon', opts: NVM_OPTS, result: VERSIONS.NVM.carbon },
    // recursive resolving
    { versionRange: 'carbon14', opts: NVM_OPTS, result: VERSIONS.NVM.carbon },
  ],
  ({ title }, { versionRange, opts, fixture, result }) => {
    test(`Resolve aliases | ${title}`, async (t) => {
      const cwd =
        fixture === undefined ? undefined : `${FIXTURES_DIR}/${fixture}`
      const output = await normalizeNodeVersion(versionRange, { cwd, ...opts })
      t.is(output, result)
    })
  },
)

test('Resolve nvm aliases ignored if no NVM_DIR configured', async (t) => {
  await t.throwsAsync(
    () =>
      normalizeNodeVersion('default', {
        nvmDir: '',
      }),
    { message: 'Invalid Node version: default' },
  )
})

test('Resolved  nvm alias fails and do not loop infinitely if alias cycle is present', async (t) => {
  const AVA_TIMEOUT_CYCLE = 2000
  t.timeout(AVA_TIMEOUT_CYCLE)
  await t.throwsAsync(() => normalizeNodeVersion('cycle', NVM_OPTS), {
    message: 'Nvm alias cycle detected cycle -> ping -> pong -> ping',
  })
})

test('Resolve nvm aliases fails if nvm alias does not exists', async (t) => {
  await t.throwsAsync(() => normalizeNodeVersion('awol', NVM_OPTS))
})

test.serial('Option cwd defaults to the current directory', async (t) => {
  const currentCwd = getCwd()
  chdir(`${FIXTURES_DIR}/nvmrc`)

  try {
    const versionRange = await normalizeNodeVersion('.')
    t.is(versionRange, VERSIONS.nvmrc)
  } finally {
    chdir(currentCwd)
  }
})
