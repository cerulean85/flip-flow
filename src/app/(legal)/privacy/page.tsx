import type { Metadata } from "next"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { legalContent } from "@/lib/legal"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return legalContent[locale].privacy.metadata
}

export default async function PrivacyPage() {
  const locale = getRequestLocale(await headers())
  const content = legalContent[locale]

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">{content.privacy.title}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{content.effectiveDate}</p>
        </header>

        {content.privacy.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  )
}
