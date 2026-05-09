import { signInAsReviewer } from "@/actions/reviewer-login.actions"

export default function ReviewerSignInButton() {
  return (
    <form action={signInAsReviewer} className="flex flex-col gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/70 dark:bg-blue-950/30">
      <div>
        <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
          심사용 테스트 계정
        </p>
        <p className="mt-1 text-xs leading-5 text-blue-700/70 dark:text-blue-200/70">
          Google AdSense 검토자가 샘플 데이터가 있는 계정으로 바로 확인할 수 있습니다.
        </p>
      </div>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        테스트 계정으로 로그인
      </button>
    </form>
  )
}
