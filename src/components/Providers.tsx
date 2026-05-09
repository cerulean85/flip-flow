"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { LocaleProvider } from "@/components/LocaleProvider"
import type { Locale } from "@/lib/i18n"

export default function Providers({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
