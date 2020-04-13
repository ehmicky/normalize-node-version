import { cwd as getCwd, env as processEnv } from 'process'

import { validate } from 'jest-validate'

// Normalize options and assign default values
export const getOpts = function (opts = {}) {
  validate(opts, { exampleConfig: EXAMPLE_OPTS() })

  return { ...DEFAULT_OPTS(), ...opts }
}

const DEFAULT_OPTS = () => ({
  cache: true,
  cwd: getCwd(),
  nvmDir: processEnv.NVM_DIR,
})

const EXAMPLE_OPTS = () => ({
  ...DEFAULT_OPTS(),
  // Passed to `fetch-node-website`
  progress: false,
  mirror: 'https://nodejs.org/dist',
})
