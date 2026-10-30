import type { Metadata } from "next"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { legalContent } from "@/lib/legal"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return legalContent[locale].support.metadata
}

export default async function SupportPage() {
  const locale = getRequestLocale(await headers())
  const content = legalContent[locale].support

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-text dark:bg-zinc-950">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-link">Flip & Flow</p>
          <h1 className="text-display font-bold">{content.title}</h1>
          <p className="text-text-secondary">
            {content.description}
          </p>
        </header>

        <section className="rounded-lg border border-border p-5">
          <h2 className="text-title font-semibold">{content.emailTitle}</h2>
          <p className="mt-3 text-text-secondary">
            <a className="font-semibold text-link" href="mailto:zhwan85@dycdyp.com">
              zhwan85@dycdyp.com
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
