import { expectType, expectAssignable } from 'tsd'

import normalizeNodeVersion, {
  Options,
  SemverVersion,
} from 'normalize-node-version'

expectType<SemverVersion>(await normalizeNodeVersion('1'))
// @ts-expect-error
await normalizeNodeVersion()
// @ts-expect-error
await normalizeNodeVersion(true)

await normalizeNodeVersion('1', {})
expectAssignable<Options>({})
// @ts-expect-error
await normalizeNodeVersion('1', true)

await normalizeNodeVersion('1', { mirror: 'http://example.com' })
expectAssignable<Options>({ mirror: 'http://example.com' })
// @ts-expect-error
await normalizeNodeVersion('1', { mirror: true })

await normalizeNodeVersion('1', { fetch: true })
await normalizeNodeVersion('1', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
// @ts-expect-error
await normalizeNodeVersion('1', { fetch: 'true' })
