import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MemoryDetail from "@/components/memory/MemoryDetail"

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  const [item, decks] = await Promise.all([
    prisma.memoryItem.findFirst({
      where: { id, userId: session!.user.id },
    }),
    prisma.deck.findMany({
      where: { userId: session!.user.id },
      select: { id: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  if (!item) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <MemoryDetail item={item} decks={decks} />
    </div>
  )
}
