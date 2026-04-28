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

    const deck = await prisma.deck.findFirst({
      where: { id, userId },
      include: { _count: { select: { cards: true } } },
    })

    if (!deck) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(deck)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const { title, description, color } = await request.json()

    const result = await prisma.deck.updateMany({
      where: { id, userId },
      data: {
        title: title?.trim() || undefined,
        description: description ?? undefined,
        color: color || undefined,
      },
    })

    if (result.count === 0) return Response.json({ error: "Not found" }, { status: 404 })

    const deck = await prisma.deck.findUnique({ where: { id } })
    return Response.json(deck)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params

    const result = await prisma.deck.deleteMany({ where: { id, userId } })
    if (result.count === 0) return Response.json({ error: "Not found" }, { status: 404 })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
