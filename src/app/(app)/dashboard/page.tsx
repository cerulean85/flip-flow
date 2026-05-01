import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeckList from "@/components/deck/DeckList"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [decks, cards] = await Promise.all([
    prisma.deck.findMany({
      where: { userId },
      include: { _count: { select: { cards: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.card.findMany({
      where: { deck: { userId } },
      select: {
        id: true,
        front: true,
        back: true,
        deckId: true,
        deck: { select: { id: true, title: true, color: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  return <DeckList decks={decks} cards={cards} />
}
