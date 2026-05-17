"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MemoryItemType } from "@/generated/prisma/enums"
import {
  defineWordInKorean,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"
import { computeNextReview, type Grade } from "@/lib/memory-srs"
import {
  MEMORY_LONG_TEXT_MAX as LONG_TEXT_MAX,
  MEMORY_TITLE_MAX as TITLE_MAX,
  VALID_MEMORY_ITEM_TYPES as VALID_TYPES,
  VALID_REVIEW_GRADES as VALID_GRADES,
} from "@/lib/memory-constants"

export type MemoryFormErrorCode =
  | "unauthorized"
  | "required_field"
  | "too_long"
  | "source_not_found"
  | "memory_not_found"
  | "save_failed"

export type MemoryFormState = { errorCode: MemoryFormErrorCode } | null

class FormValidationError extends Error {
  constructor(public code: MemoryFormErrorCode) {
    super(code)
  }
}

function parseType(value: FormDataEntryValue | null): MemoryItemType {
  const raw = (value as string | null)?.trim()
  if (raw && VALID_TYPES.has(raw as MemoryItemType)) return raw as MemoryItemType
  return "WORD"
}

function optionalString(value: FormDataEntryValue | null, max = LONG_TEXT_MAX) {
  const trimmed = ((value as string | null) ?? "").trim()
  if (trimmed.length === 0) return null
  if (trimmed.length > max) throw new FormValidationError("too_long")
  return trimmed
}

function requiredString(value: FormDataEntryValue | null, max: number) {
  const trimmed = ((value as string | null) ?? "").trim()
  if (!trimmed) throw new FormValidationError("required_field")
  if (trimmed.length > max) throw new FormValidationError("too_long")
  return trimmed
}

async function verifyMemoryOwnership(id: string, userId: string) {
  const item = await prisma.memoryItem.findFirst({
    where: { id, userId },
  })
  if (!item) throw new FormValidationError("memory_not_found")
  return item
}

async function verifySourceOwnership(opts: {
  userId: string
  deckId?: string | null
  cardId?: string | null
  essayId?: string | null
}) {
  const { userId, deckId, cardId, essayId } = opts
  if (deckId) {
    const deck = await prisma.deck.findFirst({ where: { id: deckId, userId } })
    if (!deck) throw new FormValidationError("source_not_found")
  }
  if (cardId) {
    const card = await prisma.card.findFirst({
      where: { id: cardId, deck: { userId } },
    })
    if (!card) throw new FormValidationError("source_not_found")
  }
  if (essayId) {
    const essay = await prisma.essay.findFirst({ where: { id: essayId, userId } })
    if (!essay) throw new FormValidationError("source_not_found")
  }
}

export async function createMemoryItem(
  _prev: MemoryFormState,
  formData: FormData
): Promise<MemoryFormState> {
  const session = await auth()
  if (!session?.user?.id) return { errorCode: "unauthorized" }

  let redirectTarget: string
  try {
    const title = requiredString(formData.get("title"), TITLE_MAX)
    const type = parseType(formData.get("type"))
    const meaning = optionalString(formData.get("meaning"))
    const explanation = optionalString(formData.get("explanation"))
    const example = optionalString(formData.get("example"))
    const contextText = optionalString(formData.get("contextText"))
    const deckId = optionalString(formData.get("deckId"))
    const cardId = optionalString(formData.get("cardId"))
    const essayId = optionalString(formData.get("essayId"))

    await verifySourceOwnership({
      userId: session.user.id,
      deckId,
      cardId,
      essayId,
    })

    const existing = await prisma.memoryItem.findFirst({
      where: { userId: session.user.id, title, type },
      select: { id: true },
    })
    if (existing) {
      redirectTarget = `/memory/${existing.id}`
    } else {
      const item = await prisma.memoryItem.create({
        data: {
          userId: session.user.id,
          title,
          type,
          meaning,
          explanation,
          example,
          contextText,
          deckId,
          cardId,
          essayId,
        },
      })
      redirectTarget = `/memory/${item.id}`
    }
  } catch (err) {
    if (err instanceof FormValidationError) return { errorCode: err.code }
    console.error(err)
    return { errorCode: "save_failed" }
  }

  revalidatePath("/memory")
  redirect(redirectTarget)
}

export async function updateMemoryItem(
  id: string,
  _prev: MemoryFormState,
  formData: FormData
): Promise<MemoryFormState> {
  const session = await auth()
  if (!session?.user?.id) return { errorCode: "unauthorized" }

  try {
    await verifyMemoryOwnership(id, session.user.id)

    const title = requiredString(formData.get("title"), TITLE_MAX)
    const type = parseType(formData.get("type"))
    const meaning = optionalString(formData.get("meaning"))
    const explanation = optionalString(formData.get("explanation"))
    const example = optionalString(formData.get("example"))
    const contextText = optionalString(formData.get("contextText"))

    await prisma.memoryItem.update({
      where: { id },
      data: { title, type, meaning, explanation, example, contextText },
    })
  } catch (err) {
    if (err instanceof FormValidationError) return { errorCode: err.code }
    console.error(err)
    return { errorCode: "save_failed" }
  }

  revalidatePath("/memory")
  revalidatePath(`/memory/${id}`)
  redirect(`/memory/${id}`)
}

export async function deleteMemoryItem(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyMemoryOwnership(id, session.user.id)

  await prisma.memoryItem.delete({ where: { id } })

  revalidatePath("/memory")
  redirect("/memory")
}

export async function toggleBookmarkMemoryItem(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const item = await verifyMemoryOwnership(id, session.user.id)

  await prisma.memoryItem.update({
    where: { id },
    data: { isBookmarked: !item.isBookmarked },
  })

  revalidatePath("/memory")
  revalidatePath(`/memory/${id}`)
}

export async function gradeReview(id: string, grade: Grade) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (!VALID_GRADES.has(grade)) throw new Error("Invalid grade")

  const item = await verifyMemoryOwnership(id, session.user.id)

  const { nextReviewAt, nextDifficulty } = computeNextReview(
    { difficulty: item.difficulty, reviewCount: item.reviewCount },
    grade
  )

  await prisma.memoryItem.update({
    where: { id },
    data: {
      nextReviewAt,
      difficulty: nextDifficulty,
      lastReviewedAt: new Date(),
      reviewCount: { increment: 1 },
    },
  })

  revalidatePath("/memory")
  revalidatePath("/memory/review")
  revalidatePath(`/memory/${id}`)
}

export async function exportToDeck(id: string, deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const item = await verifyMemoryOwnership(id, session.user.id)
  await verifySourceOwnership({ userId: session.user.id, deckId })

  const front = item.title
  const back = item.meaning ?? item.explanation ?? ""
  if (!front.trim() || !back.trim()) {
    throw new Error("Both front and back are required to export")
  }

  if (item.cardId && item.deckId === deckId) {
    const existing = await prisma.card.findFirst({
      where: { id: item.cardId, deckId, deck: { userId: session.user.id } },
      select: { id: true },
    })
    if (existing) {
      return { cardId: existing.id, deckId, alreadyExported: true as const }
    }
  }

  const card = await prisma.card.create({
    data: { front, back, deckId },
  })

  await prisma.memoryItem.update({
    where: { id },
    data: { cardId: card.id, deckId },
  })

  revalidatePath(`/decks/${deckId}`)
  revalidatePath(`/memory/${id}`)

  return { cardId: card.id, deckId, alreadyExported: false as const }
}

export async function enrichWithAI(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const item = await verifyMemoryOwnership(id, session.user.id)

  let aiText: string
  try {
    aiText = await defineWordInKorean(item.title)
  } catch (error) {
    if (error instanceof OpenAiConfigurationError) {
      throw new Error("AI is not configured")
    }
    if (error instanceof OpenAiRequestError) {
      throw new Error(`AI request failed (${error.status})`)
    }
    throw error
  }

  const trimmed = aiText.trim()
  if (!trimmed) {
    throw new Error("AI returned an empty result")
  }

  const firstLine = trimmed.split("\n").find((line) => line.trim().length > 0)?.trim() ?? null

  await prisma.memoryItem.update({
    where: { id },
    data: {
      explanation: trimmed,
      meaning: item.meaning ?? firstLine,
    },
  })

  revalidatePath(`/memory/${id}`)
}
