import ThemeToggle from "@/components/settings/ThemeToggle"

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">설정</h1>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">테마</h2>
        <p className="mb-4 text-xs text-gray-500">앱 전체에 적용될 색 테마를 선택하세요.</p>
        <ThemeToggle />
      </section>
    </div>
  )
}
