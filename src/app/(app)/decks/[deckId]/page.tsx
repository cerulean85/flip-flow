import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardForm from "@/components/flashcard/CardForm"
import DeleteDeckButton from "@/components/deck/DeleteDeckButton"
import EditDeckSection from "@/components/deck/EditDeckSection"
import CardListItem from "@/components/flashcard/CardListItem"

interface Props {
  params: Promise<{ deckId: string }>
}

export default async function DeckDetailPage({ params }: Props) {
  const { deckId } = await params
  const session = await auth()

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
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">←</Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{deck.title}</h1>
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
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              학습 시작
            </Link>
          )}
          <DeleteDeckButton deckId={deckId} />
        </div>
      </div>

      {deck.description && (
        <p className="text-sm text-gray-500 mb-4 ml-8 dark:text-gray-400">{deck.description}</p>
      )}

      {deck.cards.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">아직 카드가 없어요. 아래에서 추가해보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {deck.cards.map((card, i) => (
            <CardListItem
              key={card.id}
              index={i}
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

      <CardForm deckId={deckId} />
    </div>
  )
}
