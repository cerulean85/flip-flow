import type { Metadata } from "next"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { legalContent } from "@/lib/legal"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return legalContent[locale].terms.metadata
}

export default async function TermsPage() {
  const locale = getRequestLocale(await headers())
  const content = legalContent[locale]

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-text dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-link">Flip & Flow</p>
          <h1 className="text-display font-bold">{content.terms.title}</h1>
          <p className="text-sm text-text-muted">{content.effectiveDate}</p>
        </header>

        {content.terms.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-title font-semibold">{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  )
}
