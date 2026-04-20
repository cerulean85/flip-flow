import Link from "next/link"
import type { Deck } from "@/generated/prisma/client"

interface DeckCardProps {
  deck: Deck & { _count: { cards: number } }
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link
      href={`/decks/${deck.id}`}
      className="block rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
      style={{ backgroundColor: deck.color + "15", borderLeft: `4px solid ${deck.color}` }}
    >
      <h3 className="font-semibold text-gray-800 text-base truncate">{deck.title}</h3>
      {deck.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{deck.description}</p>
      )}
      <p className="text-xs text-gray-400 mt-3">{deck._count.cards}장</p>
    </Link>
  )
}
