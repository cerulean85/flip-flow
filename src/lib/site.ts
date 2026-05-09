export const APP_BASE_URL = "https://flip-flow.dycdyp.com"

const appHosts = new Set(["flip-flow.dycdyp.com", "www.flip-flow.dycdyp.com"])
const localHosts = new Set(["localhost", "127.0.0.1"])

export function normalizeHost(host: string | null | undefined) {
  return host?.split(":")[0].toLowerCase()
}

export function isAppHost(host: string | null | undefined) {
  const normalizedHost = normalizeHost(host)
  return normalizedHost ? appHosts.has(normalizedHost) : false
}

export function getAppBaseUrl(host: string | null | undefined) {
  const normalizedHost = normalizeHost(host)

  if (normalizedHost && localHosts.has(normalizedHost)) {
    return ""
  }

  return APP_BASE_URL
}
