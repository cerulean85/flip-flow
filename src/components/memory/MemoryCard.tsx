"use client"

import Link from "next/link"
import { Bookmark } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import { formatLocalizedDate } from "@/lib/date"
import { useLocale } from "@/components/LocaleProvider"
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

export default function MemoryCard({ item }: Props) {
  const { locale } = useLocale()

  return (
    <Link
      href={`/memory/${item.id}`}
      className="block rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
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
      <h3 className="line-clamp-2 text-base font-semibold text-text">
        {item.title}
      </h3>
      {item.meaning && (
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">
          {item.meaning}
        </p>
      )}
      <p className="mt-3 text-xs text-text-subtle">
        {formatLocalizedDate(item.updatedAt, locale)}
      </p>
    </Link>
  )
}
