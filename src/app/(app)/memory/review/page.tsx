import Link from "next/link"
import { BookMarked } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { formatLocalizedDate } from "@/lib/date"
import { headers } from "next/headers"
import ReviewSession, { type ReviewItem } from "@/components/memory/ReviewSession"

const MAX_BATCH = 30

export default async function MemoryReviewPage() {
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const now = new Date()

  const due = await prisma.memoryItem.findMany({
    where: {
      userId: session!.user.id,
      OR: [
        { nextReviewAt: null },
        { nextReviewAt: { lte: now } },
      ],
    },
    orderBy: [{ nextReviewAt: "asc" }, { createdAt: "asc" }],
    take: MAX_BATCH,
    select: {
      id: true,
      type: true,
      title: true,
      meaning: true,
      example: true,
      explanation: true,
    },
  })

  if (due.length === 0) {
    const next = await prisma.memoryItem.findFirst({
      where: { userId: session!.user.id, nextReviewAt: { gt: now } },
      orderBy: { nextReviewAt: "asc" },
      select: { nextReviewAt: true },
    })

    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-xl font-bold text-gray-800 dark:text-zinc-100">
          {t.memory.review.title}
        </h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <BookMarked
            size={48}
            strokeWidth={1.5}
            className="mx-auto mb-3 text-gray-300 dark:text-zinc-600"
            aria-hidden="true"
          />
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {t.memory.review.empty}
          </p>
          {next?.nextReviewAt && (
            <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
              {t.memory.review.nextDue(formatLocalizedDate(next.nextReviewAt, locale))}
            </p>
          )}
          <Link
            href="/memory"
            className="mt-5 inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {t.memory.review.backToList}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-gray-800 dark:text-zinc-100">
        {t.memory.review.title}
      </h1>
      <ReviewSession items={due as ReviewItem[]} />
    </div>
  )
}
