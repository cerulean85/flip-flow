import type { LucideIcon } from "lucide-react"
import { Bookmark, Layers, Smartphone, Wand2 } from "lucide-react"
import type { Locale } from "@/lib/i18n"

export type LandingCard = {
  front: string
  pos: string
  example: string
  back: string
  note: string
}

export type LandingContent = {
  metadata: {
    title: string
    description: string
  }
  nav: {
    howItWorks: string
    support: string
    start: string
    languageLabel: string
  }
  hero: {
    badge: string
    titlePrefix: string
    titleMiddle: string
    titleAccent: string
    description: string
    primaryCta: string
    secondaryCta: string
    bullets: string[]
  }
  featuresIntro: {
    eyebrow: string
    title: string
    description: string
  }
  features: Array<{
    Icon: LucideIcon
    title: string
    body: string
  }>
  stepsIntro: {
    eyebrow: string
    title: string
  }
  steps: Array<{
    number: string
    title: string
    body: string
    image: string
    alt: string
    imageClassName: string
  }>
  cta: {
    title: string
    description: string
    button: string
  }
  footer: {
    copyright: string
    terms: string
    privacy: string
    support: string
  }
  flipCard: {
    hint: string
    ariaLabel: string
    practice: string
    definition: string
    cards: LandingCard[]
  }
  theme: {
    change: string
    system: string
    dark: string
    light: string
    ariaTemplate: string
  }
}

const screenshots = {
  dashboard: "/images/landing/app-dashboard-clean.png",
  study: "/images/landing/app-study-open.png",
  essays: "/images/landing/app-essays-clean.png",
}

export const landingContent: Record<Locale, LandingContent> = {
  ko: {
    metadata: {
      title: "Flip & Flow | 영어 플래시카드 학습",
      description:
        "직접 만든 카드를 3D 플립으로 복습하고, AI 예문으로 연습하고, 짧은 에세이로 굳히는 개인 영어 학습 공간입니다.",
    },
    nav: {
      howItWorks: "사용 방법",
      support: "문의",
      start: "시작하기",
      languageLabel: "언어",
    },
    hero: {
      badge: "AI와 함께 외우는 영어 카드",
      titlePrefix: "단어를 카드로,",
      titleMiddle: "학습을",
      titleAccent: "흐름으로.",
      description:
        "내가 만든 카드를 3D 플립과 슬라이드로 복습하고, AI가 만든 예문으로 연습하고, 짧은 에세이로 굳히세요. 영어 학습의 흐름이 한 곳에서 이어집니다.",
      primaryCta: "무료로 시작하기",
      secondaryCta: "어떻게 작동하나요?",
      bullets: ["무료로 시작", "PWA 홈 화면 설치 지원", "카드부터 에세이까지 한 곳"],
    },
    featuresIntro: {
      eyebrow: "왜 Flip & Flow인가요?",
      title: "집중력을 끊지 않는 학습 도구",
      description:
        "불필요한 화면 전환과 메뉴를 덜어내고, 카드 한 장 안에서 학습 흐름이 완성되도록 설계했습니다.",
    },
    features: [
      {
        Icon: Layers,
        title: "3D 카드 플립",
        body: "탭 한 번이면 카드가 부드럽게 회전합니다. 앞뒤를 바로 오가며 흐름을 끊지 않고 복습하세요.",
      },
      {
        Icon: Wand2,
        title: "AI 예문 생성",
        body: "단어마다 자연스러운 예문 3개를 즉시 만들어 드려요. 문맥 안에서 외우면 더 오래 기억에 남습니다.",
      },
      {
        Icon: Bookmark,
        title: "북마크 & 에세이",
        body: "어려운 카드는 별표로 모아 집중 복습하고, 짧은 에세이로 묶어 장기 기억으로 옮깁니다.",
      },
      {
        Icon: Smartphone,
        title: "PWA로 가볍게 설치",
        body: "브라우저에서 바로 시작하고, 원하면 홈 화면에 앱처럼 설치해 모바일에서도 빠르게 이어갈 수 있습니다.",
      },
    ],
    stepsIntro: {
      eyebrow: "어떻게 쓰나요",
      title: "세 걸음이면 충분합니다",
    },
    steps: [
      {
        number: "01",
        title: "내 덱을 만들고 카드를 등록해요",
        body: "주제별로 덱을 묶고 단어와 예문을 직접 입력하세요. 새로고침 없이 즉시 저장됩니다.",
        image: screenshots.dashboard,
        alt: "Flip & Flow 덱 목록 화면",
        imageClassName: "aspect-[1440/700]",
      },
      {
        number: "02",
        title: "카드를 뒤집으며 흐름을 타요",
        body: "탭으로 뒤집고, 좌우로 슬라이드, AI 검색과 예문 연습까지. 카드 한 장 안에서 다 끝납니다.",
        image: screenshots.study,
        alt: "Flip & Flow 카드 학습 화면",
        imageClassName: "aspect-[1440/880]",
      },
      {
        number: "03",
        title: "기억을 에세이로 굳혀요",
        body: "외운 표현을 짧은 글로 묶으면 장기 기억으로 자리잡아요. 북마크와 함께 한 곳에서 관리됩니다.",
        image: screenshots.essays,
        alt: "Flip & Flow 에세이 목록 화면",
        imageClassName: "aspect-[1440/600]",
      },
    ],
    cta: {
      title: "이제 흐름을 만들 차례예요.",
      description: "5초 만에 가입하고 첫 카드를 등록해 보세요. 학습이 멈추지 않는 가장 가벼운 방법입니다.",
      button: "지금 시작하기",
    },
    footer: {
      copyright: "© 2026 Flip & Flow · DycDyp learning studio",
      terms: "이용약관",
      privacy: "개인정보처리방침",
      support: "지원",
    },
    flipCard: {
      hint: "탭하면 뒤집혀요",
      ariaLabel: "카드 뒤집기",
      practice: "연습하기",
      definition: "뜻 검색",
      cards: [
        {
          front: "resilient",
          pos: "adj.",
          example: "She stays resilient through every change.",
          back: "회복력이 있는",
          note: "다시 튀어 오르는 힘을 묘사할 때",
        },
        {
          front: "pivot",
          pos: "v.",
          example: "We had to pivot the plan halfway.",
          back: "방향을 바꾸다",
          note: "전체 흐름을 옮겨야 할 때 자연스럽게",
        },
        {
          front: "nuance",
          pos: "n.",
          example: "There's a subtle nuance in his tone.",
          back: "미묘한 차이",
          note: "감정과 표현의 결을 짚어 말할 때",
        },
        {
          front: "meticulous",
          pos: "adj.",
          example: "Her notes are meticulously kept.",
          back: "꼼꼼한",
          note: "디테일까지 빠짐없이 챙기는 모습에",
        },
      ],
    },
    theme: {
      change: "테마 변경",
      system: "시스템 테마",
      dark: "다크 테마",
      light: "라이트 테마",
      ariaTemplate: "{label}. 클릭하면 {nextTheme} 테마로 변경됩니다.",
    },
  },
  en: {
    metadata: {
      title: "Flip & Flow | English Flashcard Learning",
      description:
        "A personal English learning space for reviewing your own cards with 3D flips, practicing with AI examples, and reinforcing memory through short essays.",
    },
    nav: {
      howItWorks: "How it works",
      support: "Support",
      start: "Start",
      languageLabel: "Language",
    },
    hero: {
      badge: "English flashcards powered by AI",
      titlePrefix: "Turn words into cards,",
      titleMiddle: "and study",
      titleAccent: "in flow.",
      description:
        "Review your own cards with 3D flips and slides, practice with AI-generated examples, and lock in memory through short essays. Your English learning flow stays in one place.",
      primaryCta: "Start for free",
      secondaryCta: "See how it works",
      bullets: ["Start free", "Installable PWA", "Cards, practice, and essays together"],
    },
    featuresIntro: {
      eyebrow: "Why Flip & Flow?",
      title: "A study tool that keeps your focus intact",
      description:
        "Flip & Flow removes unnecessary screens and menus so the learning loop can happen inside one card.",
    },
    features: [
      {
        Icon: Layers,
        title: "3D card flips",
        body: "A single tap smoothly turns the card. Move between front and back without breaking your review rhythm.",
      },
      {
        Icon: Wand2,
        title: "AI example sentences",
        body: "Generate three natural examples for each word. Learning in context makes the memory last longer.",
      },
      {
        Icon: Bookmark,
        title: "Bookmarks & essays",
        body: "Star difficult cards for focused review, then turn expressions into short essays for deeper retention.",
      },
      {
        Icon: Smartphone,
        title: "Lightweight PWA",
        body: "Start in the browser and install it on your home screen when you want a faster mobile workflow.",
      },
    ],
    stepsIntro: {
      eyebrow: "How it works",
      title: "Three steps are enough",
    },
    steps: [
      {
        number: "01",
        title: "Create decks and add your cards",
        body: "Group cards by topic and enter words or example sentences yourself. Everything saves instantly.",
        image: screenshots.dashboard,
        alt: "Flip & Flow deck dashboard screen",
        imageClassName: "aspect-[1440/700]",
      },
      {
        number: "02",
        title: "Flip cards and keep the rhythm",
        body: "Tap to flip, slide between cards, search definitions, and practice examples without leaving the card.",
        image: screenshots.study,
        alt: "Flip & Flow study screen",
        imageClassName: "aspect-[1440/880]",
      },
      {
        number: "03",
        title: "Reinforce memory with essays",
        body: "Turn learned expressions into short writing. Manage essays and bookmarks together in one place.",
        image: screenshots.essays,
        alt: "Flip & Flow essay list screen",
        imageClassName: "aspect-[1440/600]",
      },
    ],
    cta: {
      title: "Now it is your turn to build the flow.",
      description: "Sign up in seconds and add your first card. It is the lightest way to keep learning moving.",
      button: "Start now",
    },
    footer: {
      copyright: "© 2026 Flip & Flow · DycDyp learning studio",
      terms: "Terms",
      privacy: "Privacy",
      support: "Support",
    },
    flipCard: {
      hint: "Tap to flip",
      ariaLabel: "Flip card",
      practice: "Practice",
      definition: "Definition",
      cards: [
        {
          front: "resilient",
          pos: "adj.",
          example: "She stays resilient through every change.",
          back: "able to recover quickly",
          note: "Useful when describing strength after setbacks.",
        },
        {
          front: "pivot",
          pos: "v.",
          example: "We had to pivot the plan halfway.",
          back: "to change direction",
          note: "Natural when a plan or strategy shifts.",
        },
        {
          front: "nuance",
          pos: "n.",
          example: "There's a subtle nuance in his tone.",
          back: "a subtle difference",
          note: "Good for describing fine shades of meaning.",
        },
        {
          front: "meticulous",
          pos: "adj.",
          example: "Her notes are meticulously kept.",
          back: "very careful and detailed",
          note: "Use it for careful work with every detail covered.",
        },
      ],
    },
    theme: {
      change: "Change theme",
      system: "System theme",
      dark: "Dark theme",
      light: "Light theme",
      ariaTemplate: "{label}. Click to switch to {nextTheme} theme.",
    },
  },
}
