"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { BookOpen, Inbox, Search, Star, X } from "lucide-react"

const PAGE_SIZE = 30
import Link from "next/link"
import type { Card } from "@/generated/prisma/client"
import { useLocale } from "@/components/LocaleProvider"
import { cn } from "@/lib/utils"
import CardForm from "./CardForm"
import CardListItem from "./CardListItem"

interface Props {
  cards: Card[]
}

export default function VocabularyList({ cards }: Props) {
  const { messages } = useLocale()
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const q = query.trim().toLowerCase()

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const card of cards) {
      if (card.category) set.add(card.category)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [cards])

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      if (activeCategory && card.category !== activeCategory) return false
      if (bookmarkedOnly && !card.isBookmark) return false
      if (q) {
        const matchFront = card.front.toLowerCase().includes(q)
        const matchBack = card.back.toLowerCase().includes(q)
        const matchCategory = card.category?.toLowerCase().includes(q) ?? false
        if (!matchFront && !matchBack && !matchCategory) return false
      }
      return true
    })
  }, [cards, q, activeCategory, bookmarkedOnly])

  const isFiltering = q.length > 0 || activeCategory !== null || bookmarkedOnly

  const filterKey = `${q}|${activeCategory ?? ""}|${bookmarkedOnly ? "1" : "0"}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const visibleCards = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!hasMore) return
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: "300px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, filtered.length])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          {messages.nav.vocabulary}
        </h1>
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          <BookOpen size={14} aria-hidden="true" />
          {messages.card.allStudy}
        </Link>
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
          placeholder={messages.card.searchPlaceholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={messages.deck.clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {categories.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              aria-pressed={activeCategory === null}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeCategory === null
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              {messages.memory.periods.all}
            </button>
            {categories.map((category) => {
              const active = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(active ? null : category)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                >
                  {category}
                </button>
              )
            })}
          </>
        )}
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
          {messages.memory.bookmarkedOnly}
        </button>
      </div>

      <CardForm className="mb-4" />

      {cards.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <Inbox size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">{messages.card.emptyInDeck}</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-zinc-500">
          {q ? messages.deck.noSearchResults(query) : messages.memory.noFilterResults}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {isFiltering && (
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              {messages.deck.matchCount(filtered.length)}
            </p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {visibleCards.map((card) => (
              <CardListItem
                key={card.id}
                cardId={card.id}
                front={card.front}
                back={card.back}
                category={card.category}
                isBookmark={card.isBookmark}
              />
            ))}
          </div>
          {hasMore && (
            <div
              ref={sentinelRef}
              aria-hidden="true"
              className="h-8 flex items-center justify-center text-[10px] text-gray-300 dark:text-zinc-600"
            >
              ...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
