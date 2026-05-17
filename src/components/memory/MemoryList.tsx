"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { BookMarked, Search, Sparkles, Star, X } from "lucide-react"
import type { MemoryItemType } from "@/generated/prisma/enums"
import { useLocale } from "@/components/LocaleProvider"
import { MEMORY_ITEM_TYPES } from "@/lib/memory-constants"
import { cn } from "@/lib/utils"
import MemoryCard from "./MemoryCard"

type Period = "all" | "today" | "week" | "month" | "quarter"
const PERIODS: Period[] = ["all", "today", "week", "month", "quarter"]
const PERIOD_DAYS: Record<Exclude<Period, "all">, number> = {
  today: 1,
  week: 7,
  month: 30,
  quarter: 90,
}

type SortKey = "updated_desc" | "updated_asc" | "title_asc" | "title_desc"
const SORT_KEYS: SortKey[] = ["updated_desc", "updated_asc", "title_asc", "title_desc"]

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

export default function MemoryList({ items, dueCount = 0 }: Props) {
  const { messages } = useLocale()
  const t = messages.memory
  const [query, setQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<Set<MemoryItemType>>(new Set())
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [period, setPeriod] = useState<Period>("all")
  const [sort, setSort] = useState<SortKey>("updated_desc")
  const q = query.trim().toLowerCase()

  function toggleType(type: MemoryItemType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const periodCutoff = useMemo(() => {
    if (period === "all") return null
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const days = PERIOD_DAYS[period]
    return new Date(startOfToday.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  }, [period])

  const isFiltering =
    q.length > 0 || selectedTypes.size > 0 || bookmarkedOnly || period !== "all"

  const filtered = useMemo(() => {
    const matched = items.filter((item) => {
      if (selectedTypes.size > 0 && !selectedTypes.has(item.type)) return false
      if (bookmarkedOnly && !item.isBookmarked) return false
      if (periodCutoff && new Date(item.updatedAt) < periodCutoff) return false
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchMeaning = item.meaning?.toLowerCase().includes(q) ?? false
        if (!matchTitle && !matchMeaning) return false
      }
      return true
    })

    const sorted = [...matched]
    switch (sort) {
      case "updated_desc":
        sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case "updated_asc":
        sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        break
      case "title_asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title_desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
    }
    return sorted
  }, [items, q, selectedTypes, bookmarkedOnly, periodCutoff, sort])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          {t.title}
        </h1>
        <div className="flex items-center gap-2">
          {dueCount > 0 && (
            <Link
              href="/memory/review"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
            >
              <Sparkles size={14} aria-hidden="true" />
              {t.review.dueBadge(dueCount)}
            </Link>
          )}
          <Link
            href="/memory/new"
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {t.newItem}
          </Link>
        </div>
      </div>

      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t.clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
          <span className="sr-only sm:not-sr-only">{t.periodLabel}</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label={t.periodLabel}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {t.periods[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
          <span className="sr-only sm:not-sr-only">{t.sortLabel}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={t.sortLabel}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {SORT_KEYS.map((s) => (
              <option key={s} value={s}>
                {t.sortOptions[s]}
              </option>
            ))}
          </select>
        </label>
        {MEMORY_ITEM_TYPES.map((type) => {
          const active = selectedTypes.has(type)
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              {t.typeLabels[type]}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setBookmarkedOnly((v) => !v)}
          aria-pressed={bookmarkedOnly}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            bookmarkedOnly
              ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-200"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          )}
        >
          <Star
            size={12}
            className={bookmarkedOnly ? "fill-amber-400 text-amber-400" : ""}
            aria-hidden="true"
          />
          {t.bookmarkedOnly}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <BookMarked size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">{t.empty}</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-zinc-500">
          {q ? t.noSearchResults(query) : t.noFilterResults}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {isFiltering && (
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              {t.matchCount(filtered.length)}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <MemoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
