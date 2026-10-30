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
import ExportToVocabularyButton from "./ExportToDeckButton"
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
    cardId: string | null
    essayId: string | null
  }
}

export default async function MemoryDetail({ item }: Props) {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MemoryTypeBadge type={item.type} />
          {item.cardId || item.essayId ? (
            <span className="text-xs text-text-subtle">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
          >
            <Pencil size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <h1 className="text-2xl font-bold text-text">{item.title}</h1>

      {item.meaning && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {t.memory.meaningLabel}
          </h2>
          <p className="whitespace-pre-wrap text-base text-text">
            {item.meaning}
          </p>
        </section>
      )}

      {item.example && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {t.memory.exampleLabel}
          </h2>
          <p className="whitespace-pre-wrap text-base italic text-text-secondary">
            {item.example}
          </p>
        </section>
      )}

      {item.explanation && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {t.memory.explanationLabel}
          </h2>
          <p className="whitespace-pre-wrap text-sm text-text-secondary">
            {item.explanation}
          </p>
        </section>
      )}

      {item.contextText && (
        <section className="mt-5">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {t.memory.contextLabel}
          </h2>
          <blockquote className="border-l-4 border-blue-300 pl-4 text-sm italic text-text-muted dark:border-blue-700">
            {item.contextText}
          </blockquote>
        </section>
      )}

      <section className="mt-6 border-t border-border pt-5">
        <SpeakingCardPractice target={item.title} />
      </section>

      <section className="mt-6 border-t border-border pt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-link">
          {t.memory.ai.sectionTitle}
        </h2>
        {!item.explanation && (
          <div className="mb-3">
            <AIEnrichButton itemId={item.id} />
          </div>
        )}
        <AIQuestionForm itemId={item.id} />
      </section>

      <section className="mt-6 border-t border-border pt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-link">
          {t.memory.export.sectionTitle}
        </h2>
        <ExportToVocabularyButton itemId={item.id} />
      </section>

      <footer className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-text-subtle">
          {formatLocalizedDate(item.updatedAt, locale)}
        </p>
        <DeleteMemoryButton itemId={item.id} />
      </footer>
    </article>
  )
}
