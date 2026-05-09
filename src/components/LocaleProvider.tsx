"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { defaultLocale } from "@/lib/i18n"
import { messages, type Messages } from "@/lib/messages"

type LocaleContextValue = {
  locale: Locale
  messages: Messages
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  messages: messages[defaultLocale],
})

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: Locale
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages: messages[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

