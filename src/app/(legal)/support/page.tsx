import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "지원 | Flip & Flow",
  description: "Flip & Flow 문의 및 지원 안내",
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Flip & Flow</p>
          <h1 className="text-3xl font-bold">문의 및 지원</h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            로그인, 계정 삭제, 학습 데이터, AI 기능과 관련한 문의를 받을 수 있습니다.
          </p>
        </header>

        <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">지원 이메일</h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            <a className="font-semibold text-blue-600 dark:text-blue-400" href="mailto:zhwan85@dycdyp.com">
              zhwan85@dycdyp.com
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
