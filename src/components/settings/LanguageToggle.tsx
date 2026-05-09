"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { locales, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"
import { setLocaleAction } from "@/actions/locale.actions"

type Props = {
  labels: Record<Locale, string>
}

export default function LanguageToggle({ labels }: Props) {
  const router = useRouter()
  const { locale } = useLocale()
  const [isPending, startTransition] = useTransition()

  const changeLocale = (nextLocale: Locale) => {
    startTransition(async () => {
      await setLocaleAction(nextLocale)
      router.refresh()
    })
  }

  return (
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
  )
}
