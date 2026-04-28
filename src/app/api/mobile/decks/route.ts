import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)

    const decks = await prisma.deck.findMany({
      where: { userId },
      include: { _count: { select: { cards: true } } },
      orderBy: { updatedAt: "desc" },
    })

    return Response.json(decks)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { title, description, color } = await request.json()

    if (!title?.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }

    const deck = await prisma.deck.create({
      data: {
        title: title.trim(),
        description: description || null,
        color: color || "#6366f1",
        userId,
      },
    })

    return Response.json(deck, { status: 201 })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
