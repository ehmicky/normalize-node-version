import test from 'ava'
import { each } from 'test-each'

import normalizeNodeVersion from '../src/main.js'

import {
  MAJOR_VERSION,
  TOO_HIGH_VERSION,
  INVALID_VERSION,
} from './helpers/versions.js'

each(
  [
    {},
    { versionRange: INVALID_VERSION },
    { versionRange: TOO_HIGH_VERSION },
    {
      versionRange: MAJOR_VERSION,
      opts: { mirror: 'not_valid_url', fetch: true },
    },
    { opts: { fetch: 0 } },
    { opts: { cwd: true } },
  ],
  ({ title }, { versionRange, opts }) => {
    test(`Invalid input | ${title}`, async (t) => {
      await t.throwsAsync(normalizeNodeVersion(versionRange, opts))
    })
  },
)
