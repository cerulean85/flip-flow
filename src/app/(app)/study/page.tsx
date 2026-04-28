import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StudyAll from "@/components/flashcard/StudyAll"

export default async function StudyAllPage() {
  const session = await auth()

  const cards = await prisma.card.findMany({
    where: { deck: { userId: session!.user.id } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">전체 학습</h1>
        <p className="text-xs text-gray-400 mt-0.5 dark:text-gray-500">모든 덱의 카드 {cards.length}장</p>
      </div>
      <StudyAll cards={cards} />
    </div>
  )
}
