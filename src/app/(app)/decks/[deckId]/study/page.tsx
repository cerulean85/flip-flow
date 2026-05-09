import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardSlider from "@/components/flashcard/CardSlider"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

interface Props {
  params: Promise<{ deckId: string }>
}

export default async function StudyPage({ params }: Props) {
  const { deckId } = await params
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: session!.user.id },
    include: { cards: { orderBy: { order: "asc" } } },
  })

  if (!deck) notFound()
  if (deck.cards.length === 0) notFound()

  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/decks/${deckId}`} className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300">←</Link>
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-zinc-100">{deck.title}</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500">{t.deck.studyMode}</p>
        </div>
      </div>
      <CardSlider cards={deck.cards} />
    </div>
  )
}
