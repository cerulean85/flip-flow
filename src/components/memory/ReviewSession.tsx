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
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CheckCircle2
          size={48}
          strokeWidth={1.5}
          className="mx-auto mb-3 text-emerald-500"
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
          {t.allDone}
        </h2>
        {completed > 0 && (
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {t.reviewedCount(completed)}
          </p>
        )}
        <Link
          href="/memory"
          className="mt-5 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          {t.backToList}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
        <MemoryTypeBadge type={current.type} />
        <span>{t.progress(index + 1, total)}</span>
      </div>

      <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
          {current.title}
        </h2>

        {revealed ? (
          <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 dark:border-zinc-800">
            {current.meaning && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
                  {messages.memory.meaningLabel}
                </h3>
                <p className="whitespace-pre-wrap text-base text-gray-800 dark:text-zinc-200">
                  {current.meaning}
                </p>
              </section>
            )}
            {current.example && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-500">
                  {messages.memory.exampleLabel}
                </h3>
                <p className="whitespace-pre-wrap text-base italic text-gray-700 dark:text-zinc-300">
                  {current.example}
                </p>
              </section>
            )}
            {!current.meaning && !current.example && current.explanation && (
              <section>
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-zinc-300">
                  {current.explanation}
                </p>
              </section>
            )}
            {!current.meaning && !current.example && !current.explanation && (
              <p className="text-center text-sm italic text-gray-400 dark:text-zinc-500">
                {t.noAnswer}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-xl bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
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
