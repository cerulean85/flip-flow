import { NextRequest } from "next/server"
import { verifyMobileToken } from "@/lib/mobile-auth"
import {
  defineWordInKorean,
  OpenAiConfigurationError,
  OpenAiRequestError,
} from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    await verifyMobileToken(request)
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

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
        return Response.json({ error: "API 한도를 초과했습니다." }, { status: 429 })
      }
      if (error.status === 401) {
        return Response.json({ error: "API 키가 유효하지 않습니다." }, { status: 401 })
      }
      return Response.json({ error: `API 오류 (${error.status})` }, { status: error.status })
    }
    return Response.json({ error: "결과를 가져올 수 없습니다." }, { status: 500 })
  }
}
