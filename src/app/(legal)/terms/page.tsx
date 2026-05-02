import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "이용약관 | Flip & Flow",
  description: "Flip & Flow 이용약관",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">이용약관</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">시행일: 2026년 5월 2일</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">서비스</h2>
          <p>
            Flip & Flow는 개인 학습용 플래시카드, 에세이 작성, AI 보조 학습 기능을 제공합니다.
            사용자는 본인이 학습할 권리가 있는 콘텐츠를 입력해야 합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">계정</h2>
          <p>
            사용자는 Google 또는 Apple 계정으로 로그인할 수 있습니다. 계정 삭제는 앱 설정 화면에서
            요청할 수 있으며, 삭제 시 저장된 학습 데이터가 함께 삭제됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">AI 결과</h2>
          <p>
            AI가 생성한 뜻풀이와 예문은 학습 보조 목적이며, 항상 정확하거나 완전하지 않을 수 있습니다.
            중요한 판단에는 별도의 확인이 필요합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">제한</h2>
          <p>
            불법적이거나 타인의 권리를 침해하는 콘텐츠 입력, 서비스 남용, 보안 우회 시도는 허용되지
            않습니다.
          </p>
        </section>
      </article>
    </main>
  )
}
