"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { locales, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"
import { setLocaleAction } from "@/actions/locale.actions"

type Props = {
  labels: Record<Locale, string>
}

export default function LanguageToggle({ labels }: Props) {
  const router = useRouter()
  const { locale, messages } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const changeLocale = (nextLocale: Locale) => {
    setError(null)
    startTransition(async () => {
      try {
        await setLocaleAction(nextLocale)
        router.refresh()
      } catch (err) {
        console.error(err)
        setError(messages.settings.languageError)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        {locales.map((value) => {
          const active = locale === value
          return (
            <button
              key={value}
              type="button"
              disabled={isPending}
              onClick={() => changeLocale(value)}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60",
                active
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              )}
            >
              {labels[value]}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
