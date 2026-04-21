import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." }, { status: 500 })
  }

  const { word } = await request.json()
  if (!word?.trim()) {
    return Response.json({ error: "단어를 입력해주세요." }, { status: 400 })
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "user",
          content: `단어 또는 표현 "${word.trim()}"의 뜻을 한국어로 설명해주세요. 품사, 핵심 의미, 간단한 예문 1개를 포함해서 간결하게 알려주세요.`,
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
    }),
  })

  if (!res.ok) {
    if (res.status === 429) {
      return Response.json(
        { error: "OpenAI API 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      )
    }
    if (res.status === 401) {
      return Response.json(
        { error: "OpenAI API 키가 유효하지 않습니다. .env.local을 확인해주세요." },
        { status: 401 }
      )
    }
    return Response.json({ error: `OpenAI API 오류 (${res.status})가 발생했습니다.` }, { status: res.status })
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? "결과를 가져올 수 없습니다."

  return Response.json({ result: text })
}
