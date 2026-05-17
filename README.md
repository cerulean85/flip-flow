# Flip-flow

**Flip-flow**는 플래시카드와 에세이 관리를 중심으로 하는 지능형 크로스 플랫폼 학습 도구입니다. 사용자가 자신만의 학습 덱을 만들고, 에세이를 작성하며, AI의 도움을 받아 발음 교정과 문장 연습을 할 수 있는 통합 환경을 제공합니다.

## 🚀 주요 기능

### 1. 플래시카드 및 학습 시스템 (Flashcards & Study)
*   **덱(Deck) & 카드(Card) 관리:** 주제별로 학습 덱을 구성하고 Markdown 형식을 지원하는 카드를 추가할 수 있습니다.
*   **인터랙티브 학습:** 카드 셔플(Shuffle) 기능과 북마크 기능을 통해 효율적인 반복 학습이 가능합니다.
*   **카드 이동 및 정리:** 덱 간 카드 이동 및 직관적인 관리 UI를 제공합니다.

### 2. 에세이 관리 시스템 (Essay Management)
*   **Markdown & LaTeX 지원:** 수식(KaTeX), 코드 블록, 인용구 등 풍부한 서식을 지원하는 에세이 작성 환경을 제공합니다.
*   **가독성 중심 렌더링:** `react-markdown`을 활용하여 모바일과 웹 모두에서 최적화된 읽기 경험을 제공합니다.

### 3. AI 기반 지능형 학습 보조 (AI-Powered Learning)
*   **문맥 기반 단어 정의:** OpenAI(Gemini 경로)를 연동하여 사용자의 문맥에 맞는 정확한 단어 뜻과 설명을 제공합니다.
*   **연습 문장 자동 생성:** 학습 중인 카드 내용을 바탕으로 AI가 실제 사용 가능한 예문을 생성해 줍니다.
*   **발음 피드백 시스템:**
    *   **Web Speech API 연동:** 사용자의 발음을 실시간으로 인식합니다.
    *   **유사도 분석:** 알고리즘을 통해 발음의 정확도를 점수로 환산하여 보여줍니다.
    *   **AI 발음 가이드:** 발음 오류 시 AI가 구체적인 개선 방법을 설명해 줍니다.

### 4. 암기장 (Memory)
플래시카드 학습 중 발견한 단어·표현·문장·문법 패턴을 별도로 모아 장기 기억으로 옮길 수 있는 공간입니다.

*   **다중 소스 수집:** 카드 학습 화면과 에세이 상세에서 "암기장에 추가" 버튼으로 항목을 모읍니다. 원본 카드/덱/에세이와의 연결이 보존되어 출처를 추적할 수 있습니다.
*   **유형 분류:** 단어(WORD) / 표현(PHRASE) / 문장(SENTENCE) / 문법(GRAMMAR_PATTERN) 4가지 유형으로 항목을 정리합니다.
*   **SRS 기반 복습:** 간격 반복(Spaced Repetition) 알고리즘으로 매일 복습이 필요한 항목을 자동 큐잉합니다. AGAIN / HARD / GOOD / EASY 4단계로 평가하면 다음 복습 시점과 난이도가 조정됩니다.
*   **AI 보강:** 등록한 항목에 대해 OpenAI 기반 뜻 자동 생성과 후속 질문 기능을 제공합니다. (rate limit, 미설정 등 상황별 안내 메시지 표시)
*   **덱 익스포트:** 정착된 항목은 원하는 덱에 플래시카드로 내보내 일반 학습 흐름과 통합할 수 있습니다.

## 🛠 기술 스택

### Web Frontend
*   **Framework:** Next.js 16 (App Router)
*   **Library:** React 19, Framer Motion
*   **Styling:** Tailwind CSS 4, Lucide React
*   **PWA:** @ducanh2912/next-pwa

### Mobile
*   **Framework:** Expo (React Native)
*   **Navigation:** Expo Router
*   **Features:** Apple Authentication, System TTS

### Backend & Database
*   **Database:** PostgreSQL (Neon Serverless)
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js 5 (Beta)

### AI & Services
*   **AI Engine:** OpenAI API
*   **Infrastructure:** Vercel

## 📦 시작하기

### 웹 서비스 실행
```bash
npm install
npm run dev
```

### 모바일 앱 실행
```bash
cd mobile
npm install
npm run ios # 또는 npm run android
```

---
Flip-flow는 지속적으로 학습자의 피드백을 반영하여 더 나은 학습 경험을 위해 발전하고 있습니다.

---

_Last updated: 2026-05-17 KST_
