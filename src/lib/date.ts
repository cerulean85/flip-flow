import type { Locale } from "@/lib/i18n"

const dateLocales: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
}

export function formatLocalizedDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

