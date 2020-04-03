[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/normalize-node-version.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/normalize-node-version)
[![Build](https://github.com/ehmicky/normalize-node-version/workflows/Build/badge.svg)](https://github.com/ehmicky/normalize-node-version/actions)
[![Node](https://img.shields.io/node/v/normalize-node-version.svg?logo=node.js)](https://www.npmjs.com/package/normalize-node-version)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/normalize-node-version.svg?logo=gitter)](https://gitter.im/ehmicky/normalize-node-version)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Normalize and validate Node.js versions

Can guess the current project's version using its `.nvmrc` if you use supported
[aliases](#supported-aliases)

# Example

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const normalizeNodeVersion = require('normalize-node-version')

await normalizeNodeVersion('8') // '8.16.0'
await normalizeNodeVersion('8.5.0') // '8.5.0'
await normalizeNodeVersion('v8.5.0') // '8.5.0'
await normalizeNodeVersion('8.5.2') // Error: Invalid Node version
await normalizeNodeVersion('<7') // '6.17.1'
await normalizeNodeVersion('*') // Latest Node version, e.g. '12.8.0'
await normalizeNodeVersion('_') // Node version used by current process
await normalizeNodeVersion('.') // Node version from a '.nvmrc', '.node-version' or '.naverc' file in the current directory or any parent directory
await normalizeNodeVersion('not_a_version') // Error: Invalid Node version

// All available options
await normalizeNodeVersion('8', {
  cache: false,
  mirror: 'https://npm.taobao.org/mirrors/node',
})
```

# Install

```bash
npm install normalize-node-version
```

# Usage

## normalizeNodeVersion(versionRange, options?)

`versionRange`: `string`\
`options`: `object`\
_Returns_: `Promise<string>`

### options

#### cache

_Type_: `boolean`\
_Default_: `true`

Cache the HTTP request to retrieve the list of available Node.js versions. The
cache is invalidated after one hour.

#### mirror

_Type_: `string`\
_Default_: `https://nodejs.org/dist`

Base URL. Can be customized (for example `https://npm.taobao.org/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

#### cache

_Type_: `string`\
_Default_: `process.cwd()`

Folder to consider to start look for a node version file when using the `.`
alias (`.node-version`, `.nvmrc` or `.naverc`)

### Supported aliases

`normalizeNodeVersion` support some node version aliases you can use as
`versionRange`:

- `_` : Node version used by current process
- `.` : Node version from a `.nvmrc`, `.node-version` or `.naverc` file in the
  current directory or any parent directory If no version file is found, it will
  resolve to current process version.

# See also

- [`nve`](https://github.com/ehmicky/nve): Run a specific Node.js version (CLI)
- [`nvexeca`](https://github.com/ehmicky/nve): Run a specific Node.js version
  (programmatic)
- [`get-node`](https://github.com/ehmicky/get-node): Download Node.js
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/normalize-node-version).

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

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/normalize-node-version/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/normalize-node-version/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
