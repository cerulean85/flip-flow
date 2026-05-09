import Link from "next/link"
import {
  ChevronRight,
  Copyright,
  FileText,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import ThemeToggle from "@/components/settings/ThemeToggle"
import SpeechVoiceSettings from "@/components/settings/SpeechVoiceSettings"
import DeleteAccountButton from "@/components/settings/DeleteAccountButton"

const supportLinks: { href: string; label: string; description: string; Icon: LucideIcon }[] = [
  {
    href: "/terms",
    label: "이용약관",
    description: "서비스 이용 조건과 계정 관련 안내를 확인합니다.",
    Icon: FileText,
  },
  {
    href: "/privacy",
    label: "개인정보처리방침",
    description: "수집 정보, 보관, 삭제 및 AI 기능 데이터 처리를 확인합니다.",
    Icon: ShieldCheck,
  },
  {
    href: "/support",
    label: "지원",
    description: "로그인, 계정 삭제, 학습 데이터 관련 문의 방법을 확인합니다.",
    Icon: Headphones,
  },
]

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-zinc-100">설정</h1>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">테마</h2>
        <p className="mb-4 text-xs text-gray-500">앱 전체에 적용될 색 테마를 선택하세요.</p>
        <ThemeToggle />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">음성</h2>
        <p className="mb-4 text-xs text-gray-500">카드 읽기에 사용할 목소리를 선택하세요.</p>
        <SpeechVoiceSettings />
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-zinc-100">
          도움말 및 정책
        </h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-zinc-400">
          서비스 이용과 개인정보, 문의 안내를 확인하세요.
        </p>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-zinc-800 dark:border-zinc-800">
          {supportLinks.map(({ href, label, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/70"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  {label}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-gray-500 dark:text-zinc-400">
                  {description}
                </span>
              </span>
              <ChevronRight
                size={18}
                className="shrink-0 text-gray-300 dark:text-zinc-600"
                aria-hidden="true"
              />
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
              <Copyright size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-gray-900 dark:text-zinc-100">
                저작권
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-gray-500 dark:text-zinc-400">
                © 2026 Flip &amp; Flow. All rights reserved.
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900 dark:bg-zinc-900">
        <h2 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">계정 삭제</h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-zinc-400">
          계정과 함께 저장된 모든 덱, 카드, 에세이가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <DeleteAccountButton />
      </section>
    </div>
  )
}
