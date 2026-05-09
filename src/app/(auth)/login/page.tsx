import SignInButton from "@/components/auth/SignInButton"
import AppleSignInButton from "@/components/auth/AppleSignInButton"
import ReviewerSignInButton from "@/components/auth/ReviewerSignInButton"
import Logo from "@/components/ui/Logo"
import Link from "next/link"

export default function LoginPage() {
  const reviewerLoginEnabled = process.env.REVIEWER_LOGIN_ENABLED === "true"

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 dark:bg-zinc-900 dark:border dark:border-zinc-800">
        <div className="flex flex-col items-center gap-3">
          <Logo size={56} showText={false} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-1 dark:text-blue-400">Flip &amp; Flow</h1>
            <p className="text-gray-500 text-sm">복잡함은 덜어내고, 암기의 흐름만 남기다.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <SignInButton />
          <AppleSignInButton />
        </div>
        {reviewerLoginEnabled && <ReviewerSignInButton />}
        <Link
          href="https://dycdyp.com"
          className="text-center text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
        >
          서비스 소개 보기
        </Link>
      </div>
    </main>
  )
}
