"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyCardOwnership(cardId: string, userId: string) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId },
  })
  if (!card) throw new Error("Card not found")
  return card
}

function normalizeCategory(value: FormDataEntryValue | string | null | undefined): string | null {
  if (value === undefined || value === null) return null
  const trimmed = (value as string).trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function createCard(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const front = (formData.get("front") as string).trim()
  const back = (formData.get("back") as string).trim()
  const category = normalizeCategory(formData.get("category"))
  if (!front || !back) throw new Error("Front and back are required")

  await prisma.card.create({
    data: { front, back, category, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/study")
  revalidatePath("/bookmarks")
}

export async function createCardFromSentence(
  sentence: { en: string; ko: string },
  category?: string | null
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const front = sentence.en.trim()
  const back = sentence.ko.trim()
  if (!front || !back) throw new Error("Front and back are required")

  const cleaned = normalizeCategory(category ?? null)

  await prisma.card.create({
    data: { front, back, category: cleaned, userId: session.user.id },
  })

  revalidatePath("/dashboard")
}

export async function updateCard(cardId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyCardOwnership(cardId, session.user.id)

  const front = (formData.get("front") as string).trim()
  const back = (formData.get("back") as string).trim()
  const hasCategoryField = formData.has("category")

  const data: { front?: string; back?: string; category?: string | null } = {
    front: front || undefined,
    back: back || undefined,
  }
  if (hasCategoryField) data.category = normalizeCategory(formData.get("category"))

  const card = await prisma.card.update({
    where: { id: cardId },
    data,
  })

  revalidatePath("/dashboard")
  revalidatePath("/study")
  revalidatePath("/bookmarks")

  return card
}

export async function deleteCard(cardId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyCardOwnership(cardId, session.user.id)

  await prisma.card.delete({ where: { id: cardId } })

  revalidatePath("/dashboard")
  revalidatePath("/study")
  revalidatePath("/bookmarks")
}

export async function changeCardCategory(cardId: string, category: string | null) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyCardOwnership(cardId, session.user.id)

  await prisma.card.update({
    where: { id: cardId },
    data: { category: normalizeCategory(category) },
  })

  revalidatePath("/dashboard")
}

export async function toggleBookmark(cardId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const card = await verifyCardOwnership(cardId, session.user.id)

  await prisma.card.update({
    where: { id: cardId },
    data: { isBookmark: !card.isBookmark },
  })

  revalidatePath("/dashboard")
  revalidatePath("/bookmarks")
}
