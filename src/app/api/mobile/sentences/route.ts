import { NextRequest } from "next/server"
import { verifyMobileToken } from "@/lib/mobile-auth"
import {
  generatePracticeSentences,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    await verifyMobileToken(request)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { front, back } = await request.json()
  if (!front?.trim() && !back?.trim()) {
    return Response.json({ error: "카드 내용이 비어 있습니다." }, { status: 400 })
  }

  try {
    const sentences = await generatePracticeSentences(front ?? "", back ?? "")
    return Response.json({ sentences })
  } catch (error) {
    if (error instanceof OpenAiConfigurationError) {
      return Response.json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." }, { status: 500 })
    }
    if (error instanceof OpenAiRequestError) {
      return Response.json({ error: `OpenAI API 오류 (${error.status})` }, { status: error.status })
    }
    return Response.json({ error: "응답을 파싱하지 못했습니다." }, { status: 500 })
  }
}
