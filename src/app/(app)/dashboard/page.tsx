import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import VocabularyList from "@/components/flashcard/VocabularyList"

export default async function VocabularyPage() {
  const session = await auth()
  const userId = session!.user.id

  const cards = await prisma.card.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })

  return <VocabularyList cards={cards} />
}
