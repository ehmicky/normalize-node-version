[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/normalize-node-version.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/normalize-node-version)
[![Build](https://github.com/ehmicky/normalize-node-version/workflows/Build/badge.svg)](https://github.com/ehmicky/normalize-node-version/actions)
[![Node](https://img.shields.io/node/v/normalize-node-version.svg?logo=node.js)](https://www.npmjs.com/package/normalize-node-version)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Normalize and validate Node.js versions.

Takes any version range as inputs such as `8`, `8.5.0` or `>=8` and returns a
`"major.minor.patch"` string. Throws if the Node.js version does not exist.

# Example

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
import normalizeNodeVersion from 'normalize-node-version'

await normalizeNodeVersion('8') // '8.17.0'
await normalizeNodeVersion('8.5.0') // '8.5.0'
await normalizeNodeVersion('v8.5.0') // '8.5.0'
await normalizeNodeVersion('<7') // '6.17.1'
await normalizeNodeVersion('8.5.2') // Error: Invalid Node version
await normalizeNodeVersion('not_a_version') // Error: Invalid Node version

// All available options
await normalizeNodeVersion('8', {
  // Use a mirror for Node.js binaries
  mirror: 'https://npm.taobao.org/mirrors/node',
  // Do not cache the list of available Node.js versions
  fetch: true,
})
```

# Install

```bash
npm install normalize-node-version
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# Usage

## normalizeNodeVersion(versionRange, options?)

`versionRange`: `string`\
`options`: `object?`\
_Returns_: `Promise<string>`

### options

#### mirror

_Type_: `string`\
_Default_: `https://nodejs.org/dist`

Base URL to fetch the list of available Node.js versions. Can be customized (for
example `https://npm.taobao.org/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

#### fetch

_Type_: `boolean`\
_Default_: `undefined`

The list of available Node.js versions is cached for one hour by default. If the
`fetch` option is:

- `true`: the cache will not be used
- `false`: the cache will be used even if it's older than one hour

# See also

- [`nve`](https://github.com/ehmicky/nve): Run a specific Node.js version (CLI)
- [`nvexeca`](https://github.com/ehmicky/nve): Run a specific Node.js version
  (programmatic)
- [`get-node`](https://github.com/ehmicky/get-node): Download Node.js
- [`preferred-node-version`](https://github.com/ehmicky/preferred-node-version):
  Get the preferred Node.js version of a project or user
- [`node-version-alias`](https://github.com/ehmicky/node-version-alias): Resolve
  Node.js version aliases like `latest`, `lts` or `erbium`
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

Thanks go to our wonderful contributors:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt=""/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/normalize-node-version/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/normalize-node-version/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://twitter.com/adrieankhisbe"><img src="https://avatars1.githubusercontent.com/u/2601132?v=4" width="100px;" alt=""/><br /><sub><b>Adrien Becchis</b></sub></a><br /><a href="https://github.com/ehmicky/normalize-node-version/commits?author=AdrieanKhisbe" title="Code">💻</a> <a href="https://github.com/ehmicky/normalize-node-version/commits?author=AdrieanKhisbe" title="Tests">⚠️</a> <a href="#ideas-AdrieanKhisbe" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
