export const locales = ["ko", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "ko"

export function isLocale(value: string | undefined): value is Locale {
  return value === "ko" || value === "en"
}

export function getLocaleFromAcceptLanguage(value: string | null): Locale {
  if (!value) return defaultLocale

  const preferred = value
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean)

  return preferred.some((locale) => locale === "en" || locale.startsWith("en-"))
    ? "en"
    : defaultLocale
}

export function getRequestLocale(headersList: { get(name: string): string | null }): Locale {
  const requestLocale = headersList.get("x-flip-flow-locale") ?? undefined
  if (isLocale(requestLocale)) return requestLocale

  const cookieLocale = headersList
    .get("cookie")
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("NEXT_LOCALE="))
    ?.split("=")[1]
  if (isLocale(cookieLocale)) return cookieLocale

  return getLocaleFromAcceptLanguage(headersList.get("accept-language"))
}
