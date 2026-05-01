import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." }, { status: 500 })
  }

  const { front, back } = await request.json()
  if (!front?.trim() && !back?.trim()) {
    return Response.json({ error: "카드 내용이 비어 있습니다." }, { status: 400 })
  }

  const prompt = `다음 단어/표현을 활용한 한국어 회화 예문 3개와 각각의 자연스러운 영어 번역을 만들어주세요.

앞면: ${front?.trim() ?? ""}
뒷면: ${back?.trim() ?? ""}

응답은 다음 JSON 형식으로만 작성하세요:
{
  "sentences": [
    { "ko": "한국어 문장", "en": "English translation" }
  ]
}

요구사항:
- sentences 배열에 정확히 3개의 객체
- ko: 일상에서 쓰일 만한 자연스러운 한국어 회화 표현
- en: 직역이 아닌, 자연스러운 영어 표현
- 다양한 상황(일상, 직장, 가족, 친구 등)
- JSON 외에 설명, 마크다운, 코드 펜스 등 일체 포함하지 말 것`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" },
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
  const text: string = data.choices?.[0]?.message?.content ?? "{}"
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim()

  let parsed: { sentences?: { ko?: string; en?: string }[] }
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: "응답을 파싱하지 못했습니다." }, { status: 500 })
  }

  const sentences = Array.isArray(parsed?.sentences)
    ? parsed.sentences
        .filter(
          (s): s is { ko: string; en: string } =>
            typeof s?.ko === "string" && s.ko.trim().length > 0 && typeof s?.en === "string" && s.en.trim().length > 0
        )
        .map((s) => ({ ko: s.ko.trim(), en: s.en.trim() }))
        .slice(0, 3)
    : []

  return Response.json({ sentences })
}
