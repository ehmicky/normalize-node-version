import type {
  Options as AllNodeVersionsOptions,
  SemverVersion,
} from 'all-node-versions'

/**
 * Semantic version, e.g. `1.2.3`
 */
export type { SemverVersion }

/**
 * Semantic version range, e.g. `1.2.3`, `1`, `>1` or `2 - 3`
 */
export type SemverRange = string

export interface Options {
  /**
   * Base URL to fetch the list of available Node.js versions.
   * Can be customized (for example `https://npmmirror.com/mirrors/node`).
   *
   * The following environment variables can also be used: `NODE_MIRROR`,
   * `NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.
   *
   * @default 'https://nodejs.org/dist'
   */
  mirror?: AllNodeVersionsOptions['mirror']

  /**
   * The list of available Node.js versions is cached for one hour by default.
   * If the `fetch` option is:
   *  - `true`: the cache will not be used
   *  - `false`: the cache will be used even if it's older than one hour
   *
   * @default `undefined``
   */
  fetch?: AllNodeVersionsOptions['fetch']
}

/**
 * Normalize and validate Node.js versions.
 *
 * Takes any version range as inputs such as `8`, `8.5.0` or `>=8` and returns a
 * `"major.minor.patch"` string. Throws if the Node.js version does not exist.
 *
 * @example
 * ```js
 * await normalizeNodeVersion('8') // '8.17.0'
 * await normalizeNodeVersion('8.5.0') // '8.5.0'
 * await normalizeNodeVersion('v8.5.0') // '8.5.0'
 * await normalizeNodeVersion('<7') // '6.17.1'
 * await normalizeNodeVersion('8.5.2') // Error: Invalid Node version
 * await normalizeNodeVersion('not_a_version') // Error: Invalid Node version
 *
 * // All available options
 * await normalizeNodeVersion('8', {
 *   // Use a mirror for Node.js binaries
 *   mirror: 'https://npmmirror.com/mirrors/node',
 *   // Do not cache the list of available Node.js versions
 *   fetch: true,
 * })
 * ```
 */
export default function normalizeNodeVersion(
  versionRange: SemverRange,
  options?: Options,
): Promise<SemverVersion>
