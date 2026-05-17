import Link from "next/link"
import { Pencil } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { formatLocalizedDate } from "@/lib/date"
import { headers } from "next/headers"
import MemoryTypeBadge from "./MemoryTypeBadge"
import BookmarkMemoryButton from "./BookmarkMemoryButton"
import DeleteMemoryButton from "./DeleteMemoryButton"
import AIEnrichButton from "./AIEnrichButton"
import AIQuestionForm from "./AIQuestionForm"
import ExportToDeckButton from "./ExportToDeckButton"
import { SpeakingCardPractice } from "@/components/speaking/SpeakingPractice"

interface Props {
  item: {
    id: string
    type: MemoryItemType
    title: string
    meaning: string | null
    explanation: string | null
    example: string | null
    contextText: string | null
    isBookmarked: boolean
    updatedAt: Date
    deckId: string | null
    cardId: string | null
    essayId: string | null
  }
  decks: { id: string; title: string }[]
}

export default async function MemoryDetail({ item, decks }: Props) {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MemoryTypeBadge type={item.type} />
          {item.deckId || item.cardId || item.essayId ? (
            <span className="text-xs text-gray-400 dark:text-zinc-500">
              {t.memory.fromSource}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <BookmarkMemoryButton itemId={item.id} isBookmarked={item.isBookmarked} />
          <Link
            href={`/memory/${item.id}/edit`}
            aria-label={t.memory.edit}
            title={t.memory.edit}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Pencil size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{item.title}</h1>

      {item.meaning && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
            {t.memory.meaningLabel}
          </h2>
          <p className="whitespace-pre-wrap text-base text-gray-800 dark:text-zinc-200">
            {item.meaning}
          </p>
        </section>
      )}

      {item.example && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
            {t.memory.exampleLabel}
          </h2>
          <p className="whitespace-pre-wrap text-base italic text-gray-700 dark:text-zinc-300">
            {item.example}
          </p>
        </section>
      )}

      {item.explanation && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
            {t.memory.explanationLabel}
          </h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-zinc-300">
            {item.explanation}
          </p>
        </section>
      )}

      {item.contextText && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
            {t.memory.contextLabel}
          </h2>
          <blockquote className="border-l-4 border-blue-300 pl-4 text-sm italic text-gray-600 dark:border-blue-700 dark:text-zinc-400">
            {item.contextText}
          </blockquote>
        </section>
      )}

      {item.type === "SENTENCE" && (
        <section className="mt-6 border-t border-gray-100 pt-5 dark:border-zinc-800">
          <SpeakingCardPractice target={item.title} />
        </section>
      )}

      <section className="mt-6 border-t border-gray-100 pt-5 dark:border-zinc-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {t.memory.ai.sectionTitle}
        </h2>
        {!item.explanation && (
          <div className="mb-3">
            <AIEnrichButton itemId={item.id} />
          </div>
        )}
        <AIQuestionForm itemId={item.id} />
      </section>

      <section className="mt-6 border-t border-gray-100 pt-5 dark:border-zinc-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {t.memory.export.sectionTitle}
        </h2>
        <ExportToDeckButton itemId={item.id} decks={decks} />
      </section>

      <footer className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          {formatLocalizedDate(item.updatedAt, locale)}
        </p>
        <DeleteMemoryButton itemId={item.id} />
      </footer>
    </article>
  )
}
