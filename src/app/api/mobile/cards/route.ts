import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

function normalizeCategory(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const body = await request.json()

    const front = typeof body?.front === "string" ? body.front.trim() : ""
    const back = typeof body?.back === "string" ? body.back.trim() : ""
    if (!front || !back) {
      return Response.json({ error: "front and back are required" }, { status: 400 })
    }

    const card = await prisma.card.create({
      data: {
        front,
        back,
        category: normalizeCategory(body?.category),
        userId,
      },
    })

    return Response.json(card, { status: 201 })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
