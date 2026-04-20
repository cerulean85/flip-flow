import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeckList from "@/components/deck/DeckList"

export default async function DashboardPage() {
  const session = await auth()
  const decks = await prisma.deck.findMany({
    where: { userId: session!.user.id },
    include: { _count: { select: { cards: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return <DeckList decks={decks} />
}
