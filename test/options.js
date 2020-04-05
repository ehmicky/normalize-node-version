import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

each(
  [
    {},
    { versionRange: 'not_a_version_range' },
    { versionRange: '50' },
    { versionRange: '4', opts: { mirror: 'not_valid_url', cache: false } },
    { opts: { cache: null } },
    { opts: { cwd: true } },
  ],
  ({ title }, { versionRange, opts }) => {
    test(`Invalid input | ${title}`, async (t) => {
      await t.throwsAsync(normalizeNodeVersion(versionRange, opts))
    })
  },
)
