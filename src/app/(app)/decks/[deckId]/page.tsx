import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardForm from "@/components/flashcard/CardForm"
import DeleteDeckButton from "@/components/deck/DeleteDeckButton"
import DeleteCardButton from "@/components/flashcard/DeleteCardButton"
import EditCardButton from "@/components/flashcard/EditCardButton"
import EditDeckSection from "@/components/deck/EditDeckSection"

interface Props {
  params: Promise<{ deckId: string }>
}

export default async function DeckDetailPage({ params }: Props) {
  const { deckId } = await params
  const session = await auth()

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: session!.user.id },
    include: { cards: { orderBy: { order: "asc" } } },
  })

  if (!deck) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700">←</Link>
          <h1 className="text-xl font-bold text-gray-800">{deck.title}</h1>
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
        <p className="text-sm text-gray-500 mb-4 ml-8">{deck.description}</p>
      )}

      {deck.cards.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">아직 카드가 없어요. 아래에서 추가해보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {deck.cards.map((card, i) => (
            <div
              key={card.id}
              className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
            >
              <span className="text-xs text-gray-300 font-mono pt-0.5 min-w-[1.5rem]">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{card.front}</p>
                <p className="text-sm text-gray-500 truncate">{card.back}</p>
                <EditCardButton
                  cardId={card.id}
                  deckId={deckId}
                  front={card.front}
                  back={card.back}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {card.isBookmark && <span className="text-yellow-400 text-sm">⭐</span>}
                <DeleteCardButton cardId={card.id} deckId={deckId} />
              </div>
            </div>
          ))}
        </div>
      )}

      <CardForm deckId={deckId} />
    </div>
  )
}
