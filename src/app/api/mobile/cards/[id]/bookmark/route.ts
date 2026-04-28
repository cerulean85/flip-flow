import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params

    const card = await prisma.card.findFirst({
      where: { id, deck: { userId } },
    })
    if (!card) return Response.json({ error: "Not found" }, { status: 404 })

    const updated = await prisma.card.update({
      where: { id },
      data: { isBookmark: !card.isBookmark },
    })

    return Response.json(updated)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
