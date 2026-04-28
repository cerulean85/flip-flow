import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const { front, back } = await request.json()

    const card = await prisma.card.findFirst({
      where: { id, deck: { userId } },
    })
    if (!card) return Response.json({ error: "Not found" }, { status: 404 })

    const updated = await prisma.card.update({
      where: { id },
      data: {
        front: front?.trim() || undefined,
        back: back?.trim() || undefined,
      },
    })

    return Response.json(updated)
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

    const card = await prisma.card.findFirst({
      where: { id, deck: { userId } },
    })
    if (!card) return Response.json({ error: "Not found" }, { status: 404 })

    await prisma.card.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
