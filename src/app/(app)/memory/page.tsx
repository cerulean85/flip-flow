import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MemoryList from "@/components/memory/MemoryList"

export default async function MemoryPage() {
  const session = await auth()
  const now = new Date()

  const [items, dueCount] = await Promise.all([
    prisma.memoryItem.findMany({
      where: { userId: session!.user.id },
      select: {
        id: true,
        title: true,
        meaning: true,
        type: true,
        isBookmarked: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.memoryItem.count({
      where: {
        userId: session!.user.id,
        OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }],
      },
    }),
  ])

  return <MemoryList items={items} dueCount={dueCount} />
}
