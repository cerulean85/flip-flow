"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createEssay(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = (formData.get("title") as string).trim()
  if (!title) throw new Error("Title is required")

  const content = ((formData.get("content") as string) ?? "").trim()

  const essay = await prisma.essay.create({
    data: { title, content, userId: session.user.id },
  })

  revalidatePath("/essays")
  redirect(`/essays/${essay.id}`)
}

export async function updateEssay(essayId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = (formData.get("title") as string).trim()
  if (!title) throw new Error("Title is required")

  const content = ((formData.get("content") as string) ?? "").trim()

  await prisma.essay.updateMany({
    where: { id: essayId, userId: session.user.id },
    data: { title, content },
  })

  revalidatePath("/essays")
  revalidatePath(`/essays/${essayId}`)
  redirect(`/essays/${essayId}`)
}

export async function deleteEssay(essayId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.essay.deleteMany({
    where: { id: essayId, userId: session.user.id },
  })

  revalidatePath("/essays")
  redirect("/essays")
}
