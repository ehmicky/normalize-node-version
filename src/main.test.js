import test from 'ava'
import normalizeNodeVersion from 'normalize-node-version'
import { each } from 'test-each'

const FULL_VERSION = '4.9.1'
const RANGES = ['4', '4.*', '<5']
const TOO_HIGH_VERSION = '90'
const INVALID_VERSION = 'not_a_valid_version'

each(
  [
    {},
    { versionRange: INVALID_VERSION },
    { versionRange: TOO_HIGH_VERSION },
    { opts: true },
    {
      versionRange: FULL_VERSION,
      opts: { mirror: 'not_valid_url', fetch: true },
    },
    { opts: { fetch: 0 } },
  ],
  ({ title }, { versionRange, opts }) => {
    test(`Invalid input | ${title}`, async (t) => {
      await t.throwsAsync(normalizeNodeVersion(versionRange, opts))
    })
  },
)

each(RANGES, ({ title }, versionRange) => {
  test(`Resolves versions range | ${title}`, async (t) => {
    const version = await normalizeNodeVersion(versionRange)
    t.is(version, FULL_VERSION)
  })
})
