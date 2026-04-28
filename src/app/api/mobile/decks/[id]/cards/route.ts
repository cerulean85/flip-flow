import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params

    const deck = await prisma.deck.findFirst({ where: { id, userId } })
    if (!deck) return Response.json({ error: "Not found" }, { status: 404 })

    const cards = await prisma.card.findMany({
      where: { deckId: id },
      orderBy: { createdAt: "asc" },
    })

    return Response.json(cards)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const { front, back } = await request.json()

    const deck = await prisma.deck.findFirst({ where: { id, userId } })
    if (!deck) return Response.json({ error: "Not found" }, { status: 404 })

    if (!front?.trim() || !back?.trim()) {
      return Response.json({ error: "Front and back are required" }, { status: 400 })
    }

    const card = await prisma.card.create({
      data: { front: front.trim(), back: back.trim(), deckId: id },
    })

    return Response.json(card, { status: 201 })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
