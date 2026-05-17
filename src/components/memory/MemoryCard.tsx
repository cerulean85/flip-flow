import Link from "next/link"
import { Bookmark } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import { formatLocalizedDate } from "@/lib/date"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"
import MemoryTypeBadge from "./MemoryTypeBadge"

interface Props {
  item: {
    id: string
    title: string
    meaning: string | null
    type: MemoryItemType
    isBookmarked: boolean
    updatedAt: Date
  }
}

export default async function MemoryCard({ item }: Props) {
  const locale = getRequestLocale(await headers())

  return (
    <Link
      href={`/memory/${item.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <MemoryTypeBadge type={item.type} />
        {item.isBookmarked && (
          <Bookmark
            size={16}
            className="shrink-0 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
        )}
      </div>
      <h3 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-zinc-100">
        {item.title}
      </h3>
      {item.meaning && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-zinc-400">
          {item.meaning}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
        {formatLocalizedDate(item.updatedAt, locale)}
      </p>
    </Link>
  )
}
