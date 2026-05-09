"use client"

import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const themes = ["light", "dark", "system"] as const

type Props = {
  labels?: {
    change: string
    system: string
    dark: string
    light: string
    ariaTemplate: string
  }
}

const defaultLabels: Required<Props>["labels"] = {
  change: "테마 변경",
  system: "시스템 테마",
  dark: "다크 테마",
  light: "라이트 테마",
  ariaTemplate: "{label}. 클릭하면 {nextTheme} 테마로 변경됩니다.",
}

export default function LandingThemeButton({ labels = defaultLabels }: Props) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // next-themes resolves theme on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const currentTheme = mounted ? themes.find((value) => value === theme) ?? "system" : "system"
  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length]

  const Icon = !mounted || currentTheme === "system" ? Monitor : currentTheme === "dark" ? Moon : Sun
  const label = !mounted
    ? labels.change
    : currentTheme === "system"
      ? labels.system
      : currentTheme === "dark"
        ? labels.dark
        : labels.light

  return (
    <button
      type="button"
      aria-label={labels.ariaTemplate
        .replace("{label}", label)
        .replace("{nextTheme}", nextTheme)}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/70 text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-zinc-900"
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
