import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EssayList from "@/components/essay/EssayList"

export default async function EssaysPage() {
  const session = await auth()

  const essays = await prisma.essay.findMany({
    where: { userId: session!.user.id },
    select: { id: true, title: true, content: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  })

  return <EssayList essays={essays} />
}
