import { NextRequest } from "next/server"
import {
  defineWordInKorean,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"

export async function POST(request: NextRequest) {
  const { word } = await request.json()
  if (!word?.trim()) {
    return Response.json({ error: "단어를 입력해주세요." }, { status: 400 })
  }

  try {
    const text = await defineWordInKorean(word)
    return Response.json({ result: text || "결과를 가져올 수 없습니다." })
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
    return Response.json({ error: "결과를 가져올 수 없습니다." }, { status: 500 })
  }
}
