import { Star } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardSlider from "@/components/flashcard/CardSlider"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

export default async function BookmarksPage() {
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const cards = await prisma.card.findMany({
    where: { isBookmark: true, userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-xl font-bold text-gray-800 mb-4 dark:text-zinc-100">
        {t.card.bookmarks}
      </h1>

      {cards.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-zinc-500">
          <Star size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">{t.card.emptyBookmarks}</p>
          <p className="text-sm">{t.card.bookmarkHint}</p>
        </div>
      ) : (
        <CardSlider cards={cards} controlsPosition="top" />
      )}
    </div>
  )
}
