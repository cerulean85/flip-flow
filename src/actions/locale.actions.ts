"use server"

import { cookies } from "next/headers"
import { isLocale, type Locale } from "@/lib/i18n"

export async function setLocaleAction(locale: Locale) {
  if (!isLocale(locale)) return

  ;(await cookies()).set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}

