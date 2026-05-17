import Link from "next/link"
import { BookMarked, Sparkles } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"
import MemoryCard from "./MemoryCard"

interface Props {
  items: {
    id: string
    title: string
    meaning: string | null
    type: MemoryItemType
    isBookmarked: boolean
    updatedAt: Date
  }[]
  dueCount?: number
}

export default async function MemoryList({ items, dueCount = 0 }: Props) {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          {t.memory.title}
        </h1>
        <div className="flex items-center gap-2">
          {dueCount > 0 && (
            <Link
              href="/memory/review"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
            >
              <Sparkles size={14} aria-hidden="true" />
              {t.memory.review.dueBadge(dueCount)}
            </Link>
          )}
          <Link
            href="/memory/new"
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {t.memory.newItem}
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <BookMarked size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">{t.memory.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <MemoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
