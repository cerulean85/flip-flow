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
        <h1 className="mb-4 text-display font-bold text-text">
          {t.memory.review.title}
        </h1>
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <BookMarked
            size={48}
            strokeWidth={1.5}
            className="mx-auto mb-3 text-text-subtle"
            aria-hidden="true"
          />
          <p className="text-sm text-text-muted">
            {t.memory.review.empty}
          </p>
          {next?.nextReviewAt && (
            <p className="mt-2 text-xs text-text-subtle">
              {t.memory.review.nextDue(formatLocalizedDate(next.nextReviewAt, locale))}
            </p>
          )}
          <Link
            href="/memory"
            className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {t.memory.review.backToList}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-display font-bold text-text">
        {t.memory.review.title}
      </h1>
      <ReviewSession items={due as ReviewItem[]} />
    </div>
  )
}
