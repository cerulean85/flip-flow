"use client"

import type { Deck } from "@/generated/prisma/client"
import DeckCard from "./DeckCard"
import Link from "next/link"
import { Layers, Search, X } from "lucide-react"
import { useMemo, useState } from "react"

interface CardWithDeck {
  id: string
  front: string
  back: string
  deckId: string
  deck: { id: string; title: string; color: string }
}

interface DeckListProps {
  decks: (Deck & { _count: { cards: number } })[]
  cards: CardWithDeck[]
}

export default function DeckList({ decks, cards }: DeckListProps) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const matchedCards = useMemo(() => {
    if (!q) return []
    return cards.filter(
      (c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
    )
  }, [cards, q])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">내 덱</h1>
        <Link
          href="/decks/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + 새 덱
        </Link>
      </div>

      <div className="relative mb-4">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="모든 카드에서 검색"
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

      {q ? (
        <CardSearchResults cards={matchedCards} query={query} />
      ) : decks.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <Layers size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">아직 덱이 없어요. 첫 번째 덱을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  )
}

function CardSearchResults({ cards, query }: { cards: CardWithDeck[]; query: string }) {
  if (cards.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400 dark:text-zinc-500">
        &quot;{query}&quot;와 일치하는 카드가 없어요.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 dark:text-zinc-500">
        카드 {cards.length}개 일치
      </p>
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/decks/${card.deckId}`}
          className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-1 flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: card.deck.color }}
              aria-hidden="true"
            />
            <span className="truncate text-xs text-gray-500 dark:text-zinc-400">
              {card.deck.title}
            </span>
          </div>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">
            {card.front}
          </p>
          <p className="truncate text-sm text-gray-500 dark:text-zinc-400">{card.back}</p>
        </Link>
      ))}
    </div>
  )
}
