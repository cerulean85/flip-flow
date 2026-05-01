import { Star } from "lucide-react"
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
      <h1 className="inline-flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 dark:text-zinc-100">
        <Star size={22} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
        북마크
      </h1>

      {cards.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-zinc-500">
          <Star size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">북마크한 카드가 없어요.</p>
          <p className="text-sm">학습 중 별표를 눌러 저장해보세요!</p>
        </div>
      ) : (
        <CardSlider cards={cards} />
      )}
    </div>
  )
}
