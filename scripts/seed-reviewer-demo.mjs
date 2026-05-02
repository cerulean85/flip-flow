import { readFileSync, existsSync } from "fs"
import { neon } from "@neondatabase/serverless"

const rootEnvFiles = [".env.local", ".env"]

for (const file of rootEnvFiles) {
  if (!existsSync(file)) continue

  const content = readFileSync(file, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separator = trimmed.indexOf("=")
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, "")

    process.env[key] ??= value
  }
}

const databaseUrl = process.env.DATABASE_URL
const reviewerEmail = (process.env.REVIEWER_LOGIN_EMAIL || "tester@test.com").trim().toLowerCase()

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

const sql = neon(databaseUrl)

const decks = [
  {
    title: "여행 영어 필수 표현",
    description: "공항, 호텔, 식당에서 바로 쓰는 표현",
    color: "#3b82f6",
    cards: [
      ["Could I get a window seat?", "창가 자리로 받을 수 있을까요?"],
      ["I have a reservation under Kim.", "Kim 이름으로 예약했습니다."],
      ["Could you recommend a local dish?", "현지 음식을 추천해 주실 수 있나요?"],
      ["Where is the baggage claim?", "수하물 찾는 곳이 어디인가요?"],
      ["Can I check in early?", "일찍 체크인할 수 있나요?"],
      ["Could I have the bill, please?", "계산서 부탁드립니다."],
      ["Is there a pharmacy nearby?", "근처에 약국이 있나요?"],
      ["I would like to change my reservation.", "예약을 변경하고 싶습니다."],
      ["How long does it take to get there?", "거기까지 얼마나 걸리나요?"],
      ["Do you accept credit cards?", "카드 결제가 되나요?"],
    ],
  },
  {
    title: "비즈니스 이메일",
    description: "업무 메일에 자주 쓰는 자연스러운 문장",
    color: "#10b981",
    cards: [
      ["I hope this email finds you well.", "잘 지내고 계시길 바랍니다."],
      ["Please find the attached file.", "첨부 파일을 확인해 주세요."],
      ["Could you clarify this point?", "이 부분을 명확히 설명해 주실 수 있나요?"],
      ["I appreciate your prompt response.", "빠른 답변에 감사드립니다."],
      ["Let me follow up on this.", "이 건에 대해 후속 확인하겠습니다."],
      ["We are aligned on the timeline.", "일정에 대해 의견이 일치했습니다."],
      ["Please let me know if you have any questions.", "질문이 있으시면 알려주세요."],
      ["I will keep you posted.", "계속 공유드리겠습니다."],
      ["That works for me.", "저는 괜찮습니다."],
      ["Could we move the meeting to Friday?", "회의를 금요일로 옮길 수 있을까요?"],
    ],
  },
  {
    title: "혼동하기 쉬운 단어",
    description: "뜻은 비슷하지만 쓰임이 다른 어휘",
    color: "#f59e0b",
    cards: [
      ["affect", "영향을 미치다"],
      ["effect", "결과, 영향"],
      ["compliment", "칭찬"],
      ["complement", "보완하다"],
      ["stationary", "움직이지 않는"],
      ["stationery", "문구류"],
      ["principal", "주요한, 교장"],
      ["principle", "원칙"],
      ["ensure", "보장하다"],
      ["insure", "보험에 들다"],
    ],
  },
  {
    title: "짧은 회화 패턴",
    description: "문장 확장 연습용 기본 패턴",
    color: "#8b5cf6",
    cards: [
      ["I'm looking forward to it.", "기대하고 있어요."],
      ["That makes sense.", "말이 되네요."],
      ["It depends on the situation.", "상황에 따라 달라요."],
      ["I didn't mean to interrupt.", "방해하려던 건 아니었어요."],
      ["Let's take a closer look.", "좀 더 자세히 살펴봅시다."],
      ["I'm not sure yet.", "아직 잘 모르겠어요."],
      ["Can you give me an example?", "예시를 들어줄 수 있나요?"],
      ["I totally agree with you.", "전적으로 동의해요."],
      ["That's not what I expected.", "제가 예상한 것과 다르네요."],
      ["Let's figure it out together.", "같이 해결해 봅시다."],
    ],
  },
]

const essays = [
  {
    title: "A Small Habit That Changed My Study Routine",
    content:
      "I used to study vocabulary by reading long lists of words. It felt productive, but I forgot most of them the next day. Recently, I started writing one short sentence for every new expression. This small habit helped me remember not only the meaning, but also the situation where I could use it. I learned that a study routine does not have to be complicated. It just needs to make the next step easy enough to repeat.",
  },
  {
    title: "Why Clear Notes Matter",
    content:
      "Clear notes save time. When my notes are messy, I spend more energy understanding what I wrote than learning the idea itself. A good note has a simple title, a few important examples, and enough context to make sense later. I do not need to write everything down. I only need to capture the part that will help my future self continue quickly.",
  },
  {
    title: "Travel Experience in a New City",
    content:
      "Visiting a new city always makes me pay attention to small details. I notice how people order coffee, how buses arrive, and how signs explain directions. These details help me understand the rhythm of the place. Even when I make mistakes, such as taking the wrong train, I usually find a story worth remembering. Travel teaches me to stay flexible.",
  },
  {
    title: "The Benefit of Reviewing Every Day",
    content:
      "Daily review is powerful because it reduces pressure. Instead of waiting until I forget everything, I can return to important ideas while they are still familiar. Five minutes of review may look too short, but it keeps the connection alive. Over time, the habit becomes easier, and the results become more visible.",
  },
]

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`
}

async function main() {
  const [user] = await sql`
    INSERT INTO "User" ("id", "email", "name", "emailVerified", "createdAt")
    VALUES (${id("user")}, ${reviewerEmail}, 'App Review Tester', NOW(), NOW())
    ON CONFLICT ("email")
    DO UPDATE SET "name" = EXCLUDED."name", "emailVerified" = COALESCE("User"."emailVerified", NOW())
    RETURNING "id"
  `

  await sql`
    INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId")
    VALUES (${id("account")}, ${user.id}, 'credentials', 'reviewer', ${reviewerEmail})
    ON CONFLICT ("provider", "providerAccountId")
    DO UPDATE SET "userId" = EXCLUDED."userId"
  `

  await sql`DELETE FROM "Deck" WHERE "userId" = ${user.id}`
  await sql`DELETE FROM "Essay" WHERE "userId" = ${user.id}`

  let cardCount = 0

  for (const deck of decks) {
    const deckId = id("deck")
    await sql`
      INSERT INTO "Deck" ("id", "title", "description", "color", "createdAt", "updatedAt", "userId")
      VALUES (${deckId}, ${deck.title}, ${deck.description}, ${deck.color}, NOW(), NOW(), ${user.id})
    `

    for (const [index, card] of deck.cards.entries()) {
      await sql`
        INSERT INTO "Card" ("id", "front", "back", "isBookmark", "order", "createdAt", "updatedAt", "deckId")
        VALUES (${id("card")}, ${card[0]}, ${card[1]}, ${index % 4 === 0}, ${index}, NOW(), NOW(), ${deckId})
      `
      cardCount += 1
    }
  }

  for (const essay of essays) {
    await sql`
      INSERT INTO "Essay" ("id", "title", "content", "userId", "createdAt", "updatedAt")
      VALUES (${id("essay")}, ${essay.title}, ${essay.content}, ${user.id}, NOW(), NOW())
    `
  }

  console.log(`Seeded ${reviewerEmail}: ${decks.length} decks, ${cardCount} cards, ${essays.length} essays.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
