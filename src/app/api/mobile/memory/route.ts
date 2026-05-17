import { NextRequest } from "next/server"
import { MemoryItemType } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"
import { exceedsLimit, optionalString } from "@/lib/validation"
import {
  MEMORY_LONG_TEXT_MAX as LONG_TEXT_MAX,
  MEMORY_TITLE_MAX as TITLE_MAX,
  VALID_MEMORY_ITEM_TYPES as VALID_TYPES,
} from "@/lib/memory-constants"

type CreateMemoryBody = {
  type?: MemoryItemType
  title: string
  meaning?: string | null
  explanation?: string | null
  example?: string | null
  contextText?: string | null
  cardId?: string | null
  essayId?: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const filter = request.nextUrl.searchParams.get("filter") ?? "all"

    if (filter === "due") {
      const now = new Date()
      const items = await prisma.memoryItem.findMany({
        where: {
          userId,
          OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }],
        },
        orderBy: [
          { nextReviewAt: { sort: "asc", nulls: "first" } },
          { createdAt: "asc" },
        ],
        take: 50,
      })

      return Response.json(items)
    }

    if (filter === "bookmarked") {
      const items = await prisma.memoryItem.findMany({
        where: { userId, isBookmarked: true },
        orderBy: { updatedAt: "desc" },
        take: 50,
      })

      return Response.json(items)
    }

    const items = await prisma.memoryItem.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 100,
    })

    return Response.json(items)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const body = (await request.json()) as CreateMemoryBody
    const type = body.type ?? "WORD"

    if (!VALID_TYPES.has(type)) {
      return Response.json({ error: "Invalid type" }, { status: 400 })
    }

    if (body.title?.length > TITLE_MAX) {
      return Response.json({ error: "Title is too long" }, { status: 400 })
    }

    const title = body.title?.trim()
    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }

    const cardId = optionalString(body.cardId)
    const essayId = optionalString(body.essayId)

    if (exceedsLimit(body.meaning, LONG_TEXT_MAX)) {
      return Response.json({ error: "meaning is too long" }, { status: 400 })
    }
    if (exceedsLimit(body.explanation, LONG_TEXT_MAX)) {
      return Response.json({ error: "explanation is too long" }, { status: 400 })
    }
    if (exceedsLimit(body.example, LONG_TEXT_MAX)) {
      return Response.json({ error: "example is too long" }, { status: 400 })
    }
    if (exceedsLimit(body.contextText, LONG_TEXT_MAX)) {
      return Response.json({ error: "contextText is too long" }, { status: 400 })
    }

    if (cardId) {
      const card = await prisma.card.findFirst({
        where: { id: cardId, userId },
      })
      if (!card) return Response.json({ error: "Card not found" }, { status: 404 })
    }

    if (essayId) {
      const essay = await prisma.essay.findFirst({ where: { id: essayId, userId } })
      if (!essay) return Response.json({ error: "Essay not found" }, { status: 404 })
    }

    const existing = await prisma.memoryItem.findFirst({
      where: { userId, title, type },
    })
    if (existing) return Response.json(existing)

    const item = await prisma.memoryItem.create({
      data: {
        userId,
        title,
        type,
        meaning: optionalString(body.meaning),
        explanation: optionalString(body.explanation),
        example: optionalString(body.example),
        contextText: optionalString(body.contextText),
        cardId,
        essayId,
      },
    })

    return Response.json(item, { status: 201 })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
