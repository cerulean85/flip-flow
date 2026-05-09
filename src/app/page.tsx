import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Logo from "@/components/ui/Logo"

const appHosts = new Set(["flip-flop.dycdyp.com", "www.flip-flop.dycdyp.com"])

const features = [
  {
    title: "영어 카드 학습",
    body: "앞면과 뒷면을 넘기며 단어와 문장을 빠르게 복습할 수 있습니다.",
  },
  {
    title: "예문으로 연습",
    body: "카드에 연결된 예문을 보고 자연스럽게 문맥을 익힐 수 있습니다.",
  },
  {
    title: "개인 학습 데이터",
    body: "나만의 덱, 북마크, 에세이를 한 곳에서 관리합니다.",
  },
]

export default async function HomePage() {
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase()

  if (host && appHosts.has(host)) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-100 bg-white/90 px-5 py-4 dark:border-zinc-900 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Logo size={36} />
          <nav className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              개인정보처리방침
            </Link>
            <Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400">
              문의
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-5 py-14 sm:py-18">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">dycdyp.com</p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
                Flip &amp; Flow
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                복잡함은 덜어내고, 암기의 흐름만 남기는 개인 영어 플래시카드 서비스입니다.
                단어, 문장, 에세이를 정리하고 반복 학습할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://flip-flop.dycdyp.com/login"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Flip &amp; Flow 시작하기
              </Link>
              <Link
                href="/support"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 px-5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                문의하기
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <p className="text-xs font-semibold uppercase text-zinc-400">Today</p>
                  <p className="mt-1 text-lg font-bold">Practice Flow</p>
                </div>
                <Logo size={40} showText={false} />
              </div>
              <div className="mt-5 space-y-3">
                {["vocabulary", "sentence", "essay"].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 dark:border-zinc-800"
                  >
                    <span className="text-sm font-medium capitalize">{item}</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {index + 3} cards
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50 px-5 py-12 dark:border-zinc-900 dark:bg-zinc-900/40">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="space-y-3">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="leading-7 text-zinc-600 dark:text-zinc-300">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>© 2026 Flip &amp; Flow</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              개인정보처리방침
            </Link>
            <Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400">
              지원
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
