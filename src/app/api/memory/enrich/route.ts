import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  answerDefinitionQuestion,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"
import { apiErrorResponse } from "@/lib/api-errors"

export type MemoryEnrichErrorCode =
  | "unauthorized"
  | "bad_request"
  | "not_found"
  | "ai_not_configured"
  | "rate_limit_exceeded"
  | "ai_request_failed"

const enrichError = (code: MemoryEnrichErrorCode, status: number, detail?: string) =>
  apiErrorResponse(code, status, detail)

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return enrichError("unauthorized", 401)

  const body = await request.json().catch(() => null)
  const id = typeof body?.id === "string" ? body.id : ""
  const question = typeof body?.question === "string" ? body.question.trim() : ""

  if (!id) return enrichError("bad_request", 400, "id is required")
  if (!question) return enrichError("bad_request", 400, "question is required")
  if (question.length > 500) return enrichError("bad_request", 400, "question is too long")

  const item = await prisma.memoryItem.findFirst({
    where: { id, userId: session.user.id },
    select: { title: true, explanation: true },
  })
  if (!item) return enrichError("not_found", 404, "Memory item not found")

  try {
    const text = await answerDefinitionQuestion(item.title, item.explanation ?? "", question)
    return Response.json({ answer: text || "결과를 가져올 수 없습니다." })
  } catch (error) {
    if (error instanceof OpenAiConfigurationError) {
      return enrichError("ai_not_configured", 500)
    }
    if (error instanceof OpenAiRequestError) {
      if (error.status === 429) return enrichError("rate_limit_exceeded", 429)
      return enrichError("ai_request_failed", error.status, `AI request failed (${error.status})`)
    }
    return enrichError("ai_request_failed", 500)
  }
}
