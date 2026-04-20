"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyDeckOwnership(deckId: string, userId: string) {
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  })
  if (!deck) throw new Error("Deck not found")
  return deck
}

async function verifyCardOwnership(cardId: string, userId: string) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, deck: { userId } },
  })
  if (!card) throw new Error("Card not found")
  return card
}

export async function createCard(deckId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyDeckOwnership(deckId, session.user.id)

  const front = (formData.get("front") as string).trim()
  const back = (formData.get("back") as string).trim()
  if (!front || !back) throw new Error("Front and back are required")

  await prisma.card.create({
    data: { front, back, deckId },
  })

  revalidatePath(`/decks/${deckId}`)
}

export async function updateCard(cardId: string, deckId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyCardOwnership(cardId, session.user.id)

  const front = (formData.get("front") as string).trim()
  const back = (formData.get("back") as string).trim()

  await prisma.card.update({
    where: { id: cardId },
    data: { front: front || undefined, back: back || undefined },
  })

  revalidatePath(`/decks/${deckId}`)
}

export async function deleteCard(cardId: string, deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await verifyCardOwnership(cardId, session.user.id)

  await prisma.card.delete({ where: { id: cardId } })

  revalidatePath(`/decks/${deckId}`)
}

export async function toggleBookmark(cardId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const card = await verifyCardOwnership(cardId, session.user.id)

  await prisma.card.update({
    where: { id: cardId },
    data: { isBookmark: !card.isBookmark },
  })

  revalidatePath("/bookmarks")
  revalidatePath(`/decks/${card.deckId}`)
}
