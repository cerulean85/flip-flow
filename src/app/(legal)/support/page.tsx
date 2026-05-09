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
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            {content.description}
          </p>
        </header>

        <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">{content.emailTitle}</h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            <a className="font-semibold text-blue-600 dark:text-blue-400" href="mailto:zhwan85@dycdyp.com">
              zhwan85@dycdyp.com
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
