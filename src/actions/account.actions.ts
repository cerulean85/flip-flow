"use server"

import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Cascade rules in schema.prisma remove the user's decks/cards/essays/accounts
  await prisma.user.delete({ where: { id: session.user.id } })

  await signOut({ redirectTo: "/login" })
}
