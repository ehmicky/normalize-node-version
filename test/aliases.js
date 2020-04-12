import { cwd as getCwd, chdir } from 'process'

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
}

each(
  [
    { versionRange: 'current', fixture: 'naverc', result: VERSIONS.nave },
    {
      versionRange: 'current',
      fixture: 'node-version',
      result: VERSIONS.nodeVersion,
    },
    { versionRange: 'current', fixture: 'nvmrc', result: VERSIONS.nvmrc },
    { versionRange: 'current', fixture: 'mixed', result: VERSIONS.nodeVersion },
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

test.serial('Option cwd defaults to the current directory', async (t) => {
  const currentCwd = getCwd()
  chdir(`${FIXTURES_DIR}/nvmrc`)

  try {
    const versionRange = await normalizeNodeVersion('current')
    t.is(versionRange, VERSIONS.nvmrc)
  } finally {
    chdir(currentCwd)
  }
})
