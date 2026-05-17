import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"
import MemoryForm from "@/components/memory/MemoryForm"
import type { MemoryItemType } from "@/generated/prisma/enums"

const VALID_TYPES: ReadonlySet<MemoryItemType> = new Set([
  "WORD",
  "PHRASE",
  "SENTENCE",
  "GRAMMAR_PATTERN",
])

function parseType(value: string | undefined): MemoryItemType {
  if (value && VALID_TYPES.has(value as MemoryItemType)) return value as MemoryItemType
  return "WORD"
}

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function NewMemoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const session = await auth()
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const essayIdParam = firstString(params.essayId)
  const cardIdParam = firstString(params.cardId)

  let title = firstString(params.title) ?? ""
  let meaning: string | null = firstString(params.meaning) ?? null
  let contextText: string | null = firstString(params.contextText) ?? null
  const type = parseType(firstString(params.type))
  let resolvedCardId: string | undefined
  let resolvedEssayId: string | undefined

  if (cardIdParam) {
    const card = await prisma.card.findFirst({
      where: { id: cardIdParam, userId: session!.user.id },
      select: { id: true, front: true, back: true },
    })
    if (card) {
      title = title || card.front
      meaning = meaning ?? card.back
      resolvedCardId = card.id
    }
  }

  if (essayIdParam) {
    const essay = await prisma.essay.findFirst({
      where: { id: essayIdParam, userId: session!.user.id },
      select: { id: true, title: true },
    })
    if (essay) {
      resolvedEssayId = essay.id
      if (!contextText) contextText = `From: ${essay.title}`
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-gray-800 dark:text-zinc-100">
        {t.memory.newItem}
      </h1>
      <MemoryForm
        defaultValues={{
          title,
          type,
          meaning,
          explanation: null,
          example: null,
          contextText,
        }}
        source={{
          cardId: resolvedCardId,
          essayId: resolvedEssayId,
        }}
      />
    </div>
  )
}
