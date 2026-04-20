"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createDeck(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = (formData.get("title") as string).trim()
  if (!title) throw new Error("Title is required")

  const description = formData.get("description") as string | null
  const color = (formData.get("color") as string) || "#6366f1"

  const deck = await prisma.deck.create({
    data: { title, description: description || null, color, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  redirect(`/decks/${deck.id}`)
}

export async function updateDeck(deckId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = (formData.get("title") as string).trim()
  const description = formData.get("description") as string | null
  const color = formData.get("color") as string | null

  await prisma.deck.updateMany({
    where: { id: deckId, userId: session.user.id },
    data: {
      title: title || undefined,
      description: description || null,
      color: color || undefined,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath(`/decks/${deckId}`)
}

export async function deleteDeck(deckId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.deck.deleteMany({
    where: { id: deckId, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
