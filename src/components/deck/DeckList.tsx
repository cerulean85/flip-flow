import type { Deck } from "@/generated/prisma/client"
import DeckCard from "./DeckCard"
import Link from "next/link"
import { Layers } from "lucide-react"

interface DeckListProps {
  decks: (Deck & { _count: { cards: number } })[]
}

export default function DeckList({ decks }: DeckListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">내 덱</h1>
        <Link
          href="/decks/new"
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          + 새 덱
        </Link>
      </div>
      {decks.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-zinc-500">
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
