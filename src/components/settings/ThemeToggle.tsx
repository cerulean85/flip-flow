"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

const themeValues = ["light", "dark", "system"] as const

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { messages } = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // mount guard for next-themes hydration (SSR theme is undefined)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <div className="flex gap-2">
      {themeValues.map((value) => {
        const active = mounted && theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            )}
          >
            {messages.settings.themes[value]}
          </button>
        )
      })}
    </div>
  )
}
