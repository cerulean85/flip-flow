import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MemoryDetail from "@/components/memory/MemoryDetail"
import MemorySwipeNav from "@/components/memory/MemorySwipeNav"

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const userId = session!.user.id

  const [item, orderedIds] = await Promise.all([
    prisma.memoryItem.findFirst({
      where: { id, userId },
    }),
    prisma.memoryItem.findMany({
      where: { userId },
      select: { id: true },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  if (!item) notFound()

  const currentIndex = orderedIds.findIndex((entry: { id: string }) => entry.id === id)
  const prevId = currentIndex > 0 ? orderedIds[currentIndex - 1].id : null
  const nextId =
    currentIndex >= 0 && currentIndex < orderedIds.length - 1
      ? orderedIds[currentIndex + 1].id
      : null

  return (
    <div className="mx-auto max-w-2xl">
      <MemorySwipeNav prevId={prevId} nextId={nextId}>
        <MemoryDetail item={item} />
      </MemorySwipeNav>
    </div>
  )
}
