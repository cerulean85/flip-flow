import Link from "next/link"
import {
  ChevronRight,
  Copyright,
  FileText,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import ThemeToggle from "@/components/settings/ThemeToggle"
import SpeechVoiceSettings from "@/components/settings/SpeechVoiceSettings"
import DeleteAccountButton from "@/components/settings/DeleteAccountButton"
import LanguageToggle from "@/components/settings/LanguageToggle"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

const supportLinks: { href: string; key: "terms" | "privacy" | "support"; Icon: LucideIcon }[] = [
  {
    href: "/terms",
    key: "terms",
    Icon: FileText,
  },
  {
    href: "/privacy",
    key: "privacy",
    Icon: ShieldCheck,
  },
  {
    href: "/support",
    key: "support",
    Icon: Headphones,
  },
]

export default async function SettingsPage() {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-zinc-100">{t.settings.title}</h1>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">{t.settings.themeTitle}</h2>
        <p className="mb-4 text-xs text-gray-500">{t.settings.themeDescription}</p>
        <ThemeToggle />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">{t.settings.languageTitle}</h2>
        <p className="mb-4 text-xs text-gray-500">{t.settings.languageDescription}</p>
        <LanguageToggle labels={t.settings.languages} />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">{t.settings.voiceTitle}</h2>
        <p className="mb-4 text-xs text-gray-500">{t.settings.voiceDescription}</p>
        <SpeechVoiceSettings />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">
          {t.settings.helpTitle}
        </h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-zinc-400">
          {t.settings.helpDescription}
        </p>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-zinc-800 dark:border-zinc-800">
          {supportLinks.map(({ href, key, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/70"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  {t.settings.supportLinks[key].label}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-gray-500 dark:text-zinc-400">
                  {t.settings.supportLinks[key].description}
                </span>
              </span>
              <ChevronRight
                size={18}
                className="shrink-0 text-gray-300 dark:text-zinc-600"
                aria-hidden="true"
              />
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
              <Copyright size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">
                {t.settings.copyright}
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-gray-500 dark:text-zinc-400">
                © 2026 Flip &amp; Flow. All rights reserved.
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">{t.settings.deleteTitle}</h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-zinc-400">
          {t.settings.deleteDescription}
        </p>
        <DeleteAccountButton />
      </section>
    </div>
  )
}
