"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { CheckCircle2 } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import type { Grade } from "@/lib/memory-srs"
import { gradeReview } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"
import MemoryTypeBadge from "./MemoryTypeBadge"
import ReviewGradeButtons from "./ReviewGradeButtons"

export type ReviewItem = {
  id: string
  type: MemoryItemType
  title: string
  meaning: string | null
  example: string | null
  explanation: string | null
}

interface Props {
  items: ReviewItem[]
}

export default function ReviewSession({ items }: Props) {
  const { messages } = useLocale()
  const t = messages.memory.review

  const queue = useMemo(() => items, [items])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const current = queue[index]
  const total = queue.length
  const isDone = index >= total

  function handleGrade(grade: Grade) {
    if (!current || isPending) return
    setError(null)
    const targetId = current.id
    startTransition(async () => {
      try {
        await gradeReview(targetId, grade)
        setCompleted((value) => value + 1)
        setIndex((value) => value + 1)
        setRevealed(false)
      } catch (err) {
        console.error(err)
        setError(t.error)
      }
    })
  }

  if (isDone) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <CheckCircle2
          size={48}
          strokeWidth={1.5}
          className="mx-auto mb-3 text-emerald-500"
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold text-text">
          {t.allDone}
        </h2>
        {completed > 0 && (
          <p className="mt-1 text-sm text-text-muted">
            {t.reviewedCount(completed)}
          </p>
        )}
        <Link
          href="/memory"
          className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {t.backToList}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <MemoryTypeBadge type={current.type} />
        <span>{t.progress(index + 1, total)}</span>
      </div>

      <article className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-text">
          {current.title}
        </h2>

        {revealed ? (
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5">
            {current.meaning && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
                  {messages.memory.meaningLabel}
                </h3>
                <p className="whitespace-pre-wrap text-base text-text">
                  {current.meaning}
                </p>
              </section>
            )}
            {current.example && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-subtle">
                  {messages.memory.exampleLabel}
                </h3>
                <p className="whitespace-pre-wrap text-base italic text-text-secondary">
                  {current.example}
                </p>
              </section>
            )}
            {!current.meaning && !current.example && current.explanation && (
              <section>
                <p className="whitespace-pre-wrap text-sm text-text-secondary">
                  {current.explanation}
                </p>
              </section>
            )}
            {!current.meaning && !current.example && !current.explanation && (
              <p className="text-center text-sm italic text-text-subtle">
                {t.noAnswer}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {t.showAnswer}
            </button>
          </div>
        )}
      </article>

      {revealed && <ReviewGradeButtons onGrade={handleGrade} disabled={isPending} />}

      {error && (
        <p className="text-center text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
