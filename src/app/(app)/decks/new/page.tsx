import Link from "next/link"
import DeckForm from "@/components/deck/DeckForm"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

export default async function NewDeckPage() {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300">←</Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">{t.deck.createTitle}</h1>
      </div>
      <DeckForm />
    </div>
  )
}
