import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)

    const cards = await prisma.card.findMany({
      where: { deck: { userId }, isBookmark: true },
      orderBy: { updatedAt: "desc" },
    })

    return Response.json(cards)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
