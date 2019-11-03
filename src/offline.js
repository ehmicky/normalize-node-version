import { getCachedVersions } from './cache.js'

// When offline, we try to reuse cached versions if any is available.
// We do this even if `cache` option is `false`.
export const handleOfflineError = async function(error) {
  if (!isOffline(error)) {
    throw error
  }

  const { cachedVersions } = await getCachedVersions()

  if (cachedVersions === undefined) {
    throw error
  }

  return cachedVersions
}

// On Windows, offline errors are the same as wrong `mirror` option errors.
// Since we cannot distinguish them, we also use offline cache when `mirror`
// option is invalid.
const isOffline = function({ message }) {
  return message.includes(OFFLINE_ERROR_MESSAGE)
}

const OFFLINE_ERROR_MESSAGE = 'getaddrinfo'
