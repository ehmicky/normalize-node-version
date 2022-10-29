import { expectType, expectError, expectAssignable } from 'tsd'

import normalizeNodeVersion, {
  Options,
  SemverVersion,
} from './main.js'

expectType<SemverVersion>(await normalizeNodeVersion('1'))
expectError(await normalizeNodeVersion())
expectError(await normalizeNodeVersion(true))

await normalizeNodeVersion('1', {})
expectAssignable<Options>({})
expectError(await normalizeNodeVersion('1', true))

await normalizeNodeVersion('1', { mirror: 'http://example.com' })
expectAssignable<Options>({ mirror: 'http://example.com' })
expectError(await normalizeNodeVersion('1', { mirror: true }))

await normalizeNodeVersion('1', { fetch: true })
await normalizeNodeVersion('1', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
expectError(await normalizeNodeVersion('1', { fetch: 'true' }))
