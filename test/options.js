import test from 'ava'
// eslint-disable-next-line node/no-extraneous-import
import normalizeNodeVersion from 'normalize-node-version'
import { each } from 'test-each'

import {
  FULL_VERSION,
  TOO_HIGH_VERSION,
  INVALID_VERSION,
} from './helpers/versions.js'

each(
  [
    {},
    { versionRange: INVALID_VERSION },
    { versionRange: TOO_HIGH_VERSION },
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
