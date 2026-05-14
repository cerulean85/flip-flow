import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StudyAll from "@/components/flashcard/StudyAll"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"

export default async function StudyAllPage() {
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const cards = await prisma.card.findMany({
    where: { deck: { userId: session!.user.id } },
    include: { deck: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">{t.card.allStudy}</h1>
        <p className="text-xs text-gray-400 mt-0.5 dark:text-zinc-500">
          {t.card.allStudyCount(cards.length)}
        </p>
      </div>
      <StudyAll cards={cards} />
    </div>
  )
}
