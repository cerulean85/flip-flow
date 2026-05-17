import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"
import { computeNextReview, type Grade } from "@/lib/memory-srs"
import { VALID_REVIEW_GRADES as VALID_GRADES } from "@/lib/memory-constants"

type ReviewMemoryBody = {
  grade: Grade
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await params
    const body = (await request.json()) as ReviewMemoryBody

    if (!VALID_GRADES.has(body.grade)) {
      return Response.json({ error: "Invalid grade" }, { status: 400 })
    }

    const item = await prisma.memoryItem.findFirst({
      where: { id, userId },
    })
    if (!item) return Response.json({ error: "Not found" }, { status: 404 })

    const result = computeNextReview(
      { difficulty: item.difficulty, reviewCount: item.reviewCount },
      body.grade
    )

    const updated = await prisma.memoryItem.update({
      where: { id },
      data: {
        nextReviewAt: result.nextReviewAt,
        difficulty: result.nextDifficulty,
        lastReviewedAt: new Date(),
        reviewCount: { increment: 1 },
      },
      select: {
        id: true,
        nextReviewAt: true,
        difficulty: true,
        reviewCount: true,
      },
    })

    return Response.json(updated)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
