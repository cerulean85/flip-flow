import { NextRequest } from "next/server"
import {
  generatePracticeSentences,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"

export async function POST(request: NextRequest) {
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
      if (error.status === 429) {
        return Response.json(
          { error: "OpenAI API 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
          { status: 429 }
        )
      }
      if (error.status === 401) {
        return Response.json(
          { error: "OpenAI API 키가 유효하지 않습니다. .env.local을 확인해주세요." },
          { status: 401 }
        )
      }
      return Response.json(
        { error: `OpenAI API 오류 (${error.status})가 발생했습니다.` },
        { status: error.status }
      )
    }
    return Response.json({ error: "응답을 파싱하지 못했습니다." }, { status: 500 })
  }
}
