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
    const { toDeckId } = await request.json()

    if (!toDeckId) {
      return Response.json({ error: "toDeckId is required" }, { status: 400 })
    }

    const card = await prisma.card.findFirst({
      where: { id, deck: { userId } },
    })
    if (!card) return Response.json({ error: "Card not found" }, { status: 404 })

    const toDeck = await prisma.deck.findFirst({
      where: { id: toDeckId, userId },
    })
    if (!toDeck) return Response.json({ error: "Target deck not found" }, { status: 404 })

    const updated = await prisma.card.update({
      where: { id },
      data: { deckId: toDeckId },
    })

    return Response.json(updated)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
