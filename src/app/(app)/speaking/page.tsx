import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getRequestLocale } from "@/lib/i18n"
import { messages } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import SpeakingPractice from "@/components/speaking/SpeakingPractice"

export default async function SpeakingPage() {
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const cards = await prisma.card.findMany({
    where: { deck: { userId: session!.user.id } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
          {t.speaking.title}
        </h1>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
          {t.speaking.count(cards.length)}
        </p>
      </div>
      <SpeakingPractice cards={cards} />
    </div>
  )
}
