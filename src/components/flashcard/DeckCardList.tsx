"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import CardListItem from "./CardListItem"
import type { Card } from "@/generated/prisma/client"

interface TargetDeck {
  id: string
  title: string
  color: string
}

interface Props {
  cards: Card[]
  deckId: string
  otherDecks: TargetDeck[]
}

export default function DeckCardList({ cards, deckId, otherDecks }: Props) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return cards.map((card, index) => ({ card, index }))
    return cards
      .map((card, index) => ({ card, index }))
      .filter(
        ({ card }) =>
          card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q)
      )
  }, [cards, q])

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="카드 검색"
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="검색 지우기"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {q && (
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          {filtered.length}개 일치
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-zinc-500">
          &quot;{query}&quot;와 일치하는 카드가 없어요.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(({ card, index }) => (
            <CardListItem
              key={card.id}
              index={index}
              cardId={card.id}
              deckId={deckId}
              front={card.front}
              back={card.back}
              isBookmark={card.isBookmark}
              otherDecks={otherDecks}
            />
          ))}
        </div>
      )}
    </div>
  )
}
