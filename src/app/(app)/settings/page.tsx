import ThemeToggle from "@/components/settings/ThemeToggle"
import SpeechVoiceSettings from "@/components/settings/SpeechVoiceSettings"
import DeleteAccountButton from "@/components/settings/DeleteAccountButton"

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
