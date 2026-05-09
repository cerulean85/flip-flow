export const OPENAI_TEXT_MODEL = "gpt-4.1"

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null
    }
  }>
}

export class OpenAiConfigurationError extends Error {}

export class OpenAiRequestError extends Error {
  constructor(public status: number) {
    super(`OpenAI request failed with status ${status}`)
  }
}

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new OpenAiConfigurationError("OPENAI_API_KEY is not configured")
  }
  return apiKey
}

async function requestChatCompletion(body: Record<string, unknown>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: OPENAI_TEXT_MODEL,
      ...body,
    }),
  })

  if (!res.ok) {
    throw new OpenAiRequestError(res.status)
  }

  const data = (await res.json()) as ChatCompletionResponse
  return data.choices?.[0]?.message?.content ?? ""
}

function cleanJsonResponse(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim()
}

export type GeneratedSentence = {
  ko: string
  en: string
}

export async function defineWordInKorean(word: string) {
  const term = word.trim()

  return requestChatCompletion({
    messages: [
      {
        role: "user",
        content: `단어 또는 표현 "${term}"의 뜻을 한국어로 설명해주세요. 품사, 핵심 의미, 간단한 예문 1개를 포함해서 간결하게 알려주세요.`,
      },
    ],
    max_tokens: 300,
    temperature: 0.2,
  })
}

export async function generatePracticeSentences(front: string, back: string) {
  const frontTerm = front.trim()
  const backTerm = back.trim()

  const prompt = `다음 카드의 영어 단어/표현을 활용한 한국어 회화 예문 3개와 각각의 자연스러운 영어 번역을 만들어주세요.

앞면(영어 단어/표현): ${frontTerm}
뒷면(한국어 뜻): ${backTerm}

응답은 다음 JSON 형식으로만 작성하세요:
{
  "sentences": [
    { "ko": "한국어 문장", "en": "English translation" }
  ]
}

요구사항:
- sentences 배열에 정확히 3개의 객체
- ko: 한국어 회화 문장 안에 앞면의 영어 단어/표현 "${frontTerm}"을 영어 표기 그대로(한글 음역 금지) 반드시 1회 이상 포함시킬 것
- en: 직역이 아닌 자연스러운 영어 표현이며, 동일하게 "${frontTerm}"을 그대로 포함할 것
- 다양한 상황(일상, 직장, 가족, 친구 등)
- JSON 외에 설명, 마크다운, 코드 펜스 등 일체 포함하지 말 것`

  const text = await requestChatCompletion({
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.4,
    response_format: { type: "json_object" },
  })

  let parsed: { sentences?: { ko?: string; en?: string }[] }
  try {
    parsed = JSON.parse(cleanJsonResponse(text || "{}"))
  } catch {
    throw new Error("Failed to parse OpenAI response")
  }

  return Array.isArray(parsed?.sentences)
    ? parsed.sentences
        .filter(
          (sentence): sentence is GeneratedSentence =>
            typeof sentence?.ko === "string" &&
            sentence.ko.trim().length > 0 &&
            typeof sentence?.en === "string" &&
            sentence.en.trim().length > 0
        )
        .map((sentence) => ({ ko: sentence.ko.trim(), en: sentence.en.trim() }))
        .slice(0, 3)
    : []
}
