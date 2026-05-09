import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeleteDeckButton from "@/components/deck/DeleteDeckButton"
import EditDeckSection from "@/components/deck/EditDeckSection"
import DeckCardList from "@/components/flashcard/DeckCardList"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

interface Props {
  params: Promise<{ deckId: string }>
}

export default async function DeckDetailPage({ params }: Props) {
  const { deckId } = await params
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const [deck, otherDecks] = await Promise.all([
    prisma.deck.findFirst({
      where: { id: deckId, userId: session!.user.id },
      include: { cards: { orderBy: { order: "asc" } } },
    }),
    prisma.deck.findMany({
      where: { userId: session!.user.id, NOT: { id: deckId } },
      select: { id: true, title: true, color: true },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  if (!deck) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300">←</Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">{deck.title}</h1>
          <EditDeckSection
            deckId={deckId}
            title={deck.title}
            description={deck.description ?? ""}
            color={deck.color}
          />
        </div>
        <div className="flex items-center gap-3">
          {deck.cards.length > 0 && (
            <Link
              href={`/decks/${deckId}/study`}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t.deck.startStudy}
            </Link>
          )}
          <DeleteDeckButton deckId={deckId} />
        </div>
      </div>

      {deck.description && (
        <p className="text-sm text-gray-500 mb-4 ml-8 dark:text-zinc-400">{deck.description}</p>
      )}

      <DeckCardList cards={deck.cards} deckId={deckId} otherDecks={otherDecks} />
    </div>
  )
}
