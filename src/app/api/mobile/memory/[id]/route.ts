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

type UpdateMemoryBody = {
  type?: MemoryItemType
  title?: string | null
  meaning?: string | null
  explanation?: string | null
  example?: string | null
  contextText?: string | null
  isBookmarked?: boolean
}

type UpdateMemoryData = {
  type?: MemoryItemType
  title?: string
  meaning?: string | null
  explanation?: string | null
  example?: string | null
  contextText?: string | null
  isBookmarked?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const body = (await request.json()) as UpdateMemoryBody

    const item = await prisma.memoryItem.findFirst({
      where: { id, userId },
    })
    if (!item) return Response.json({ error: "Not found" }, { status: 404 })

    const data: UpdateMemoryData = {}

    if ("type" in body) {
      if (!body.type || !VALID_TYPES.has(body.type)) {
        return Response.json({ error: "Invalid type" }, { status: 400 })
      }
      data.type = body.type
    }

    if ("title" in body) {
      if (body.title && body.title.length > TITLE_MAX) {
        return Response.json({ error: "Title is too long" }, { status: 400 })
      }

      const title = body.title?.trim()
      if (!title) {
        return Response.json({ error: "Title is required" }, { status: 400 })
      }
      data.title = title
    }

    if ("meaning" in body && exceedsLimit(body.meaning, LONG_TEXT_MAX)) {
      return Response.json({ error: "meaning is too long" }, { status: 400 })
    }
    if ("explanation" in body && exceedsLimit(body.explanation, LONG_TEXT_MAX)) {
      return Response.json({ error: "explanation is too long" }, { status: 400 })
    }
    if ("example" in body && exceedsLimit(body.example, LONG_TEXT_MAX)) {
      return Response.json({ error: "example is too long" }, { status: 400 })
    }
    if ("contextText" in body && exceedsLimit(body.contextText, LONG_TEXT_MAX)) {
      return Response.json({ error: "contextText is too long" }, { status: 400 })
    }

    if ("meaning" in body) data.meaning = optionalString(body.meaning)
    if ("explanation" in body) data.explanation = optionalString(body.explanation)
    if ("example" in body) data.example = optionalString(body.example)
    if ("contextText" in body) data.contextText = optionalString(body.contextText)
    if ("isBookmarked" in body && typeof body.isBookmarked === "boolean") {
      data.isBookmarked = body.isBookmarked
    }

    const updated = await prisma.memoryItem.update({
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

    const item = await prisma.memoryItem.findFirst({
      where: { id, userId },
    })
    if (!item) return Response.json({ error: "Not found" }, { status: 404 })

    await prisma.memoryItem.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
