import type { Locale } from "@/lib/i18n"

type LegalSection = {
  title: string
  body: string
}

export const legalContent = {
  ko: {
    layout: {
      title: "Flip & Flow 정책",
      description: "Flip & Flow 개인정보처리방침, 이용약관, 지원 안내",
    },
    effectiveDate: "시행일: 2026년 5월 2일",
    terms: {
      metadata: {
        title: "이용약관 | Flip & Flow",
        description: "Flip & Flow 이용약관",
      },
      title: "이용약관",
      sections: [
        {
          title: "서비스",
          body: "Flip & Flow는 개인 학습용 플래시카드, 에세이 작성, AI 보조 학습 기능을 제공합니다. 사용자는 본인이 학습할 권리가 있는 콘텐츠를 입력해야 합니다.",
        },
        {
          title: "계정",
          body: "사용자는 Google 또는 Apple 계정으로 로그인할 수 있습니다. 계정 삭제는 앱 설정 화면에서 요청할 수 있으며, 삭제 시 저장된 학습 데이터가 함께 삭제됩니다.",
        },
        {
          title: "AI 결과",
          body: "AI가 생성한 뜻풀이와 예문은 학습 보조 목적이며, 항상 정확하거나 완전하지 않을 수 있습니다. 중요한 판단에는 별도의 확인이 필요합니다.",
        },
        {
          title: "제한",
          body: "불법적이거나 타인의 권리를 침해하는 콘텐츠 입력, 서비스 남용, 보안 우회 시도는 허용되지 않습니다.",
        },
      ] satisfies LegalSection[],
    },
    privacy: {
      metadata: {
        title: "개인정보처리방침 | Flip & Flow",
        description: "Flip & Flow가 수집하고 처리하는 개인정보와 AI 기능 데이터 처리 안내",
      },
      title: "개인정보처리방침",
      sections: [
        {
          title: "수집하는 정보",
          body: "Flip & Flow는 계정 제공을 위해 로그인 제공자로부터 이메일, 이름, 프로필 이미지를 받을 수 있습니다. 사용자가 앱에 입력한 덱, 카드, 북마크, 에세이 내용도 학습 기능 제공을 위해 저장됩니다.",
        },
        {
          title: "AI 기능 데이터",
          body: "단어 뜻 검색과 예문 생성 기능을 사용할 때 사용자가 입력한 단어, 카드 앞면, 카드 뒷면이 OpenAI API로 전송될 수 있습니다. 이 정보는 요청한 결과를 생성하기 위한 목적으로만 사용됩니다.",
        },
        {
          title: "보관 및 삭제",
          body: "계정 데이터는 사용자가 서비스를 이용하는 동안 보관됩니다. 앱의 설정 화면에서 계정 삭제를 요청하면 계정과 연결된 덱, 카드, 에세이, 로그인 연결 정보가 삭제됩니다.",
        },
        {
          title: "제3자 제공",
          body: "로그인 인증에는 Google 또는 Apple이 사용될 수 있으며, AI 기능에는 OpenAI가 사용될 수 있습니다. Flip & Flow는 광고 추적, 위치 정보, 연락처, 사진, 마이크 정보를 수집하지 않습니다.",
        },
        {
          title: "문의",
          body: "개인정보 또는 계정 삭제와 관련한 문의는 지원 페이지를 통해 연락해주세요.",
        },
      ] satisfies LegalSection[],
    },
    support: {
      metadata: {
        title: "지원 | Flip & Flow",
        description: "Flip & Flow 문의 및 지원 안내",
      },
      title: "문의 및 지원",
      description: "로그인, 계정 삭제, 학습 데이터, AI 기능과 관련한 문의를 받을 수 있습니다.",
      emailTitle: "지원 이메일",
    },
  },
  en: {
    layout: {
      title: "Flip & Flow Policies",
      description: "Flip & Flow privacy policy, terms, and support information",
    },
    effectiveDate: "Effective date: May 2, 2026",
    terms: {
      metadata: {
        title: "Terms | Flip & Flow",
        description: "Flip & Flow Terms of Service",
      },
      title: "Terms of Service",
      sections: [
        {
          title: "Service",
          body: "Flip & Flow provides personal learning features including flashcards, essay writing, and AI-assisted study tools. Users must only enter content they have the right to study or use.",
        },
        {
          title: "Account",
          body: "Users can sign in with a Google or Apple account. Account deletion can be requested in the app settings, and deleting an account also deletes the associated study data.",
        },
        {
          title: "AI results",
          body: "AI-generated definitions and examples are provided for study assistance and may not always be accurate or complete. Important decisions should be verified separately.",
        },
        {
          title: "Restrictions",
          body: "Illegal content, content that infringes others' rights, abuse of the service, and attempts to bypass security are not permitted.",
        },
      ] satisfies LegalSection[],
    },
    privacy: {
      metadata: {
        title: "Privacy Policy | Flip & Flow",
        description: "How Flip & Flow collects and processes personal information and AI feature data",
      },
      title: "Privacy Policy",
      sections: [
        {
          title: "Information we collect",
          body: "Flip & Flow may receive your email, name, and profile image from sign-in providers to provide account features. Decks, cards, bookmarks, and essays entered in the app are also stored to provide learning features.",
        },
        {
          title: "AI feature data",
          body: "When using word definition and example sentence features, the word, card front, and card back entered by the user may be sent to the OpenAI API. This information is used only to generate the requested result.",
        },
        {
          title: "Retention and deletion",
          body: "Account data is retained while you use the service. If you request account deletion in the app settings, your account and connected decks, cards, essays, and sign-in connections are deleted.",
        },
        {
          title: "Third parties",
          body: "Google or Apple may be used for sign-in, and OpenAI may be used for AI features. Flip & Flow does not collect ad tracking, location, contacts, photos, or microphone information.",
        },
        {
          title: "Contact",
          body: "For privacy or account deletion inquiries, please contact us through the support page.",
        },
      ] satisfies LegalSection[],
    },
    support: {
      metadata: {
        title: "Support | Flip & Flow",
        description: "Flip & Flow contact and support information",
      },
      title: "Contact & Support",
      description: "You can contact us about login, account deletion, study data, and AI features.",
      emailTitle: "Support email",
    },
  },
} satisfies Record<Locale, object>

