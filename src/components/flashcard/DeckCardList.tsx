"use client"

import { useMemo, useState } from "react"
import { Inbox, Search, X } from "lucide-react"
import CardForm from "./CardForm"
import CardListItem from "./CardListItem"
import type { Card } from "@/generated/prisma/client"
import { useLocale } from "@/components/LocaleProvider"

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
  const { messages } = useLocale()
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

      <CardForm deckId={deckId} className="mt-1" />

      {q && (
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          {messages.deck.matchCount(filtered.length)}
        </p>
      )}

      {filtered.length === 0 ? (
        q ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-zinc-500">
            {messages.deck.noSearchResults(query)}
          </p>
        ) : (
          <div className="py-8 text-center text-gray-400 dark:text-zinc-500">
            <Inbox size={40} strokeWidth={1.5} className="mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm">{messages.card.emptyInDeck}</p>
          </div>
        )
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
