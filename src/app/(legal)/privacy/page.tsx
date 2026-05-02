import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "개인정보처리방침 | Flip & Flow",
  description: "Flip & Flow가 수집하고 처리하는 개인정보와 AI 기능 데이터 처리 안내",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">개인정보처리방침</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">시행일: 2026년 5월 2일</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">수집하는 정보</h2>
          <p>
            Flip & Flow는 계정 제공을 위해 로그인 제공자로부터 이메일, 이름, 프로필 이미지를 받을 수
            있습니다. 사용자가 앱에 입력한 덱, 카드, 북마크, 에세이 내용도 학습 기능 제공을 위해
            저장됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">AI 기능 데이터</h2>
          <p>
            단어 뜻 검색과 예문 생성 기능을 사용할 때 사용자가 입력한 단어, 카드 앞면, 카드 뒷면이
            OpenAI API로 전송될 수 있습니다. 이 정보는 요청한 결과를 생성하기 위한 목적으로만
            사용됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">보관 및 삭제</h2>
          <p>
            계정 데이터는 사용자가 서비스를 이용하는 동안 보관됩니다. 앱의 설정 화면에서 계정 삭제를
            요청하면 계정과 연결된 덱, 카드, 에세이, 로그인 연결 정보가 삭제됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">제3자 제공</h2>
          <p>
            로그인 인증에는 Google 또는 Apple이 사용될 수 있으며, AI 기능에는 OpenAI가 사용될 수
            있습니다. Flip & Flow는 광고 추적, 위치 정보, 연락처, 사진, 마이크 정보를 수집하지
            않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">문의</h2>
          <p>
            개인정보 또는 계정 삭제와 관련한 문의는 지원 페이지를 통해 연락해주세요.
          </p>
        </section>
      </article>
    </main>
  )
}
