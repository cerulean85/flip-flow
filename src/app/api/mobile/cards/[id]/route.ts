import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

function normalizeCategory(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const body = await request.json()

    const card = await prisma.card.findFirst({
      where: { id, userId },
    })
    if (!card) return Response.json({ error: "Not found" }, { status: 404 })

    const data: { front?: string; back?: string; category?: string | null } = {
      front: typeof body?.front === "string" ? body.front.trim() || undefined : undefined,
      back: typeof body?.back === "string" ? body.back.trim() || undefined : undefined,
    }
    if (Object.prototype.hasOwnProperty.call(body ?? {}, "category")) {
      data.category = normalizeCategory(body.category)
    }

    const updated = await prisma.card.update({
      where: { id },
      data,
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
      where: { id, userId },
    })
    if (!card) return Response.json({ error: "Not found" }, { status: 404 })

    await prisma.card.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
