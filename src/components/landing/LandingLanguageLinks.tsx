import Link from "next/link"
import type { Locale } from "@/lib/i18n"

type Props = {
  locale: Locale
  label: string
}

export default function LandingLanguageLinks({ locale, label }: Props) {
  const nextLocale = locale === "ko" ? "en" : "ko"

  return (
    <Link
      href={`/${nextLocale}`}
      hrefLang={nextLocale}
      aria-label={label}
      className="inline-flex h-10 items-center justify-center rounded-xl border border-white/70 bg-white/70 px-3 text-xs font-black uppercase tracking-widest text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-zinc-900"
    >
      {nextLocale}
    </Link>
  )
}

