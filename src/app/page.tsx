import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowRight, Bookmark, Layers, Sparkles, Wand2 } from "lucide-react"
import LandingFlipCard from "@/components/landing/LandingFlipCard"
import LandingThemeButton from "@/components/settings/LandingThemeButton"
import Logo from "@/components/ui/Logo"

const appHosts = new Set(["flip-flow.dycdyp.com", "www.flip-flow.dycdyp.com"])

export const metadata: Metadata = {
  title: "Flip & Flow | 영어 플래시카드 학습",
  description:
    "직접 만든 카드를 3D 플립으로 복습하고, AI 예문으로 연습하고, 짧은 에세이로 굳히는 개인 영어 학습 공간입니다.",
}

const features = [
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
]

const steps = [
  {
    number: "01",
    title: "내 덱을 만들고 카드를 등록해요",
    body: "주제별로 덱을 묶고 단어와 예문을 직접 입력하세요. 새로고침 없이 즉시 저장됩니다.",
    image: "/images/landing/app-dashboard-clean.png",
    alt: "Flip & Flow 덱 목록 화면",
  },
  {
    number: "02",
    title: "카드를 뒤집으며 흐름을 타요",
    body: "탭으로 뒤집고, 좌우로 슬라이드, AI 검색과 예문 연습까지. 카드 한 장 안에서 다 끝납니다.",
    image: "/images/landing/app-study-open.png",
    alt: "Flip & Flow 카드 학습 화면",
  },
  {
    number: "03",
    title: "기억을 에세이로 굳혀요",
    body: "외운 표현을 짧은 글로 묶으면 장기 기억으로 자리잡아요. 북마크와 함께 한 곳에서 관리됩니다.",
    image: "/images/landing/app-essays-clean.png",
    alt: "Flip & Flow 에세이 목록 화면",
  },
]

export default async function HomePage() {
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase()

  if (host && appHosts.has(host)) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fafc] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Logo size={36} />
          <nav className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a
              href="#how-it-works"
              className="hidden rounded-lg px-3 py-2 hover:text-blue-600 sm:inline-flex dark:hover:text-blue-400"
            >
              사용 방법
            </a>
            <Link
              href="/support"
              className="rounded-lg px-3 py-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              문의
            </Link>
            <LandingThemeButton />
            <Link
              href="https://flip-flow.dycdyp.com/login"
              className="ml-2 hidden h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-blue-700 sm:inline-flex dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
            >
              시작하기
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-14 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_38%,#fef3c7_68%,#fce7f3_100%)] dark:bg-[linear-gradient(135deg,#09090b_0%,#172554_38%,#134e4a_70%,#3b0764_100%)]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.16) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="absolute -left-24 top-1/3 hidden h-72 w-72 rounded-full bg-blue-300/40 blur-3xl lg:block dark:bg-blue-600/20" />
        <div className="absolute -right-16 bottom-0 hidden h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl lg:block dark:bg-fuchsia-700/20" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/45 dark:text-blue-200">
              <Sparkles size={16} aria-hidden="true" />
              AI와 함께 외우는 영어 카드
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
              단어를 카드로,
              <br />
              학습을{" "}
              <span className="bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                흐름으로.
              </span>
            </h1>
            <p className="max-w-xl text-lg font-medium leading-8 text-zinc-700 sm:text-xl dark:text-zinc-200">
              내가 만든 카드를 3D 플립과 슬라이드로 복습하고, AI가 만든 예문으로 연습하고,
              짧은 에세이로 굳히세요. 영어 학습의 흐름이 한 곳에서 이어집니다.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://flip-flow.dycdyp.com/login"
                className="landing-pulse inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
              >
                무료로 시작하기
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/80 bg-white/70 px-6 text-sm font-bold text-zinc-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100"
              >
                어떻게 작동하나요?
              </a>
            </div>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              <li className="inline-flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 무료로 시작
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 설치 없이 바로 사용
              </li>
              <li className="inline-flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 카드부터 에세이까지 한 곳
              </li>
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 mx-auto my-auto h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/40 via-fuchsia-300/30 to-amber-300/30 blur-3xl dark:from-blue-700/40 dark:via-fuchsia-700/30 dark:to-amber-700/20" />
            <LandingFlipCard />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              왜 Flip &amp; Flow인가요?
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              집중력을 끊지 않는 학습 도구
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              불필요한 화면 전환과 메뉴를 덜어내고, 카드 한 장 안에서 학습 흐름이 완성되도록 설계했습니다.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, body }) => (
              <article
                key={title}
                className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-110">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[#f7fafc] px-5 py-16 sm:py-20 dark:bg-zinc-950/40"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              어떻게 쓰나요
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              세 걸음이면 충분합니다
            </h2>
          </div>
          <div className="mt-14 space-y-20 lg:space-y-24">
            {steps.map((step, i) => {
              const reverse = i % 2 === 1
              return (
                <div
                  key={step.number}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <div className={`space-y-4 ${reverse ? "lg:order-2" : ""}`}>
                    <span className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-950 px-4 font-mono text-xs font-bold tracking-widest text-white dark:bg-white dark:text-zinc-950">
                      STEP {step.number}
                    </span>
                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
                      {step.body}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-200/50 via-fuchsia-200/40 to-amber-200/40 blur-2xl dark:from-blue-700/30 dark:via-fuchsia-800/20 dark:to-amber-800/10" />
                    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 p-2 shadow-2xl shadow-blue-950/20 dark:border-zinc-800">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        width={1440}
                        height={1000}
                        className="h-auto w-full rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0c0a09_0%,#1e3a8a_50%,#581c87_100%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.18) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            이제 흐름을 만들 차례예요.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            5초 만에 가입하고 첫 카드를 등록해 보세요. 학습이 멈추지 않는 가장 가벼운 방법입니다.
          </p>
          <Link
            href="https://flip-flow.dycdyp.com/login"
            className="landing-pulse mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-zinc-950 shadow-2xl shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-100"
          >
            지금 시작하기
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white px-5 py-10 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Logo size={28} />
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              © 2026 Flip &amp; Flow · dycdyp.com learning studio
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/terms"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/support"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              지원
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
