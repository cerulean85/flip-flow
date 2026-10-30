// Demo mode: the app runs on this in-memory data instead of the server (EXPO_PUBLIC_DEMO_MODE=1).
// Cards and essays mirror scripts/seed-reviewer-demo.mjs. Changes last until the app reloads.
import type { Card, Essay, Sentence, User } from "./types"

export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === "1"

export const DEMO_USER: User = { id: "demo-user", email: "demo@flipflow.app", name: "데모 사용자", image: null }

const CARD_SEED: [front: string, back: string, category: string][] = [
  ["Could I get a window seat?", "창가 자리로 받을 수 있을까요?", "여행 영어"],
  ["I have a reservation under Kim.", "Kim 이름으로 예약했습니다.", "여행 영어"],
  ["Could you recommend a local dish?", "현지 음식을 추천해 주실 수 있나요?", "여행 영어"],
  ["Where is the baggage claim?", "수하물 찾는 곳이 어디인가요?", "여행 영어"],
  ["Can I check in early?", "일찍 체크인할 수 있나요?", "여행 영어"],
  ["Could I have the bill, please?", "계산서 부탁드립니다.", "여행 영어"],
  ["Is there a pharmacy nearby?", "근처에 약국이 있나요?", "여행 영어"],
  ["I would like to change my reservation.", "예약을 변경하고 싶습니다.", "여행 영어"],
  ["How long does it take to get there?", "거기까지 얼마나 걸리나요?", "여행 영어"],
  ["Do you accept credit cards?", "카드 결제가 되나요?", "여행 영어"],
  ["I hope this email finds you well.", "잘 지내고 계시길 바랍니다.", "비즈니스"],
  ["Please find the attached file.", "첨부 파일을 확인해 주세요.", "비즈니스"],
  ["Could you clarify this point?", "이 부분을 명확히 설명해 주실 수 있나요?", "비즈니스"],
  ["I appreciate your prompt response.", "빠른 답변에 감사드립니다.", "비즈니스"],
  ["Let me follow up on this.", "이 건에 대해 후속 확인하겠습니다.", "비즈니스"],
  ["We are aligned on the timeline.", "일정에 대해 의견이 일치했습니다.", "비즈니스"],
  ["Please let me know if you have any questions.", "질문이 있으시면 알려주세요.", "비즈니스"],
  ["I will keep you posted.", "계속 공유드리겠습니다.", "비즈니스"],
  ["That works for me.", "저는 괜찮습니다.", "비즈니스"],
  ["Could we move the meeting to Friday?", "회의를 금요일로 옮길 수 있을까요?", "비즈니스"],
  ["affect", "영향을 미치다", "혼동 어휘"],
  ["effect", "결과, 영향", "혼동 어휘"],
  ["compliment", "칭찬", "혼동 어휘"],
  ["complement", "보완하다", "혼동 어휘"],
  ["stationary", "움직이지 않는", "혼동 어휘"],
  ["stationery", "문구류", "혼동 어휘"],
  ["principal", "주요한, 교장", "혼동 어휘"],
  ["principle", "원칙", "혼동 어휘"],
  ["ensure", "보장하다", "혼동 어휘"],
  ["insure", "보험에 들다", "혼동 어휘"],
  ["I'm looking forward to it.", "기대하고 있어요.", "회화"],
  ["That makes sense.", "말이 되네요.", "회화"],
  ["It depends on the situation.", "상황에 따라 달라요.", "회화"],
  ["I didn't mean to interrupt.", "방해하려던 건 아니었어요.", "회화"],
  ["Let's take a closer look.", "좀 더 자세히 살펴봅시다.", "회화"],
  ["I'm not sure yet.", "아직 잘 모르겠어요.", "회화"],
  ["Can you give me an example?", "예시를 들어줄 수 있나요?", "회화"],
  ["I totally agree with you.", "전적으로 동의해요.", "회화"],
  ["That's not what I expected.", "제가 예상한 것과 다르네요.", "회화"],
  ["Let's figure it out together.", "같이 해결해 봅시다.", "회화"],
]

const ESSAY_SEED: [title: string, content: string][] = [
  ["A Small Habit That Changed My Study Routine", "I used to study vocabulary by reading long lists of words. It felt productive, but I forgot most of them the next day. Recently, I started writing one short sentence for every new expression. This small habit helped me remember not only the meaning, but also the situation where I could use it. I learned that a study routine does not have to be complicated. It just needs to make the next step easy enough to repeat."],
  ["Why Clear Notes Matter", "Clear notes save time. When my notes are messy, I spend more energy understanding what I wrote than learning the idea itself. A good note has a simple title, a few important examples, and enough context to make sense later. I do not need to write everything down. I only need to capture the part that will help my future self continue quickly."],
  ["Travel Experience in a New City", "Visiting a new city always makes me pay attention to small details. I notice how people order coffee, how buses arrive, and how signs explain directions. These details help me understand the rhythm of the place. Even when I make mistakes, such as taking the wrong train, I usually find a story worth remembering. Travel teaches me to stay flexible."],
  ["The Benefit of Reviewing Every Day", "Daily review is powerful because it reduces pressure. Instead of waiting until I forget everything, I can return to important ideas while they are still familiar. Five minutes of review may look too short, but it keeps the connection alive. Over time, the habit becomes easier, and the results become more visible."],
]

const BOOKMARKED = new Set([0, 3, 20, 22, 34])

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

let nextId = 1
const newId = (prefix: string) => `${prefix}-${nextId++}`

let cards: Card[] = CARD_SEED.map(([front, back, category], i) => ({
  id: newId("card"),
  front,
  back,
  category,
  isBookmark: BOOKMARKED.has(i),
  order: i,
  userId: DEMO_USER.id,
  createdAt: daysAgo(40 - i),
  updatedAt: daysAgo(40 - i),
}))

let essays: Essay[] = ESSAY_SEED.map(([title, content], i) => ({
  id: newId("essay"),
  title,
  content,
  createdAt: daysAgo(2 + i * 7),
  updatedAt: daysAgo(2 + i * 7),
}))

function demoSentences(front: string, back: string): Sentence[] {
  return [
    { ko: `${back} 이 표현을 오늘 써 봤어요.`, en: `I tried using “${front}” today.` },
    { ko: "친구에게 이 문장을 자연스럽게 말했어요.", en: `I said “${front}” to a friend naturally.` },
    { ko: "다음 여행에서도 꼭 써 볼게요.", en: `I will use “${front}” on my next trip, too.` },
  ]
}

function notFound(path: string): never {
  throw new Error(`데모 모드에서 지원하지 않는 요청이에요: ${path}`)
}

// Small delay so loading states (skeletons) are visible like on a real network
const wait = () => new Promise((resolve) => setTimeout(resolve, 350))

export async function demoRequest<T>(path: string, method: string, body: unknown): Promise<T> {
  await wait()
  const data = (body ?? {}) as Record<string, unknown>
  const [, , , resource, id, action] = path.split("/") // "", "api", "mobile", resource, id?, action?

  if (resource === "auth") return { token: "demo-token", user: DEMO_USER } as T
  if (resource === "account" && method === "DELETE") return { ok: true } as T

  if (resource === "cards") {
    if (method === "GET" && id === "all") return cards as T
    if (method === "GET" && id === "bookmarks") return cards.filter((c) => c.isBookmark) as T
    if (method === "POST" && !id) {
      const now = new Date().toISOString()
      const card: Card = {
        id: newId("card"),
        front: String(data.front ?? ""),
        back: String(data.back ?? ""),
        category: (data.category as string | null | undefined) ?? null,
        isBookmark: false,
        order: cards.length,
        userId: DEMO_USER.id,
        createdAt: now,
        updatedAt: now,
      }
      cards = [card, ...cards]
      return card as T
    }
    const card = cards.find((c) => c.id === id)
    if (!card) notFound(path)
    if (method === "POST" && action === "bookmark") {
      const updated = { ...card, isBookmark: !card.isBookmark }
      cards = cards.map((c) => (c.id === id ? updated : c))
      return updated as T
    }
    if (method === "PUT") {
      const updated: Card = { ...card, ...(data as Partial<Card>), updatedAt: new Date().toISOString() }
      cards = cards.map((c) => (c.id === id ? updated : c))
      return updated as T
    }
    if (method === "DELETE") {
      cards = cards.filter((c) => c.id !== id)
      return undefined as T
    }
  }

  if (resource === "ai" && id === "definition") {
    const word = String(data.word ?? "")
    return { result: `“${word}”의 데모 뜻풀이예요. 실제 앱에서는 AI가 문맥에 맞는 뜻과 쓰임을 알려줘요.` } as T
  }
  if (resource === "sentences") return { sentences: demoSentences(String(data.front ?? ""), String(data.back ?? "")) } as T

  if (resource === "essays") {
    if (method === "GET" && !id) return { essays } as T
    if (method === "POST" && !id) {
      const now = new Date().toISOString()
      const essay: Essay = { id: newId("essay"), title: String(data.title ?? ""), content: String(data.content ?? ""), createdAt: now, updatedAt: now }
      essays = [essay, ...essays]
      return { essay } as T
    }
    const essay = essays.find((e) => e.id === id)
    if (!essay) notFound(path)
    if (method === "GET") return { essay } as T
    if (method === "PATCH") {
      const updated = { ...essay, title: String(data.title ?? essay.title), content: String(data.content ?? essay.content), updatedAt: new Date().toISOString() }
      essays = essays.map((e) => (e.id === id ? updated : e))
      return { essay: updated } as T
    }
    if (method === "DELETE") {
      essays = essays.filter((e) => e.id !== id)
      return { ok: true } as T
    }
  }

  notFound(path)
}
