import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardSlider from "@/components/flashcard/CardSlider"

export default async function BookmarksPage() {
  const session = await auth()

  const cards = await prisma.card.findMany({
    where: { isBookmark: true, deck: { userId: session!.user.id } },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">⭐ 북마크</h1>

      {cards.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">☆</p>
          <p className="text-sm">북마크한 카드가 없어요.</p>
          <p className="text-sm">학습 중 별표를 눌러 저장해보세요!</p>
        </div>
      ) : (
        <CardSlider cards={cards} />
      )}
    </div>
  )
}
