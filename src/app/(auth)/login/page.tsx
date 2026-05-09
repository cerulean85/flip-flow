import SignInButton from "@/components/auth/SignInButton"
import AppleSignInButton from "@/components/auth/AppleSignInButton"
import ReviewerSignInButton from "@/components/auth/ReviewerSignInButton"
import Logo from "@/components/ui/Logo"
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n"
import Link from "next/link"

const loginCopy: Record<Locale, {
  tagline: string
  google: string
  apple: string
  intro: string
  languageLabel: string
  reviewerTitle: string
  reviewerDescription: string
  reviewerButton: string
}> = {
  ko: {
    tagline: "복잡함은 덜어내고, 암기의 흐름만 남기다.",
    google: "Google로 로그인",
    apple: "Apple로 로그인",
    intro: "서비스 소개 보기",
    languageLabel: "언어 변경",
    reviewerTitle: "심사용 테스트 계정",
    reviewerDescription:
      "Google AdSense 검토자가 샘플 데이터가 있는 계정으로 바로 확인할 수 있습니다.",
    reviewerButton: "테스트 계정으로 로그인",
  },
  en: {
    tagline: "Less clutter, more learning flow.",
    google: "Continue with Google",
    apple: "Continue with Apple",
    intro: "View service intro",
    languageLabel: "Change language",
    reviewerTitle: "Reviewer test account",
    reviewerDescription:
      "Google AdSense reviewers can open a sample account and inspect the product quickly.",
    reviewerButton: "Sign in as reviewer",
  },
}

type Props = {
  searchParams: Promise<{ locale?: string | string[] }>
}

export default async function LoginPage({ searchParams }: Props) {
  const reviewerLoginEnabled = process.env.REVIEWER_LOGIN_ENABLED === "true"
  const { locale: rawLocale } = await searchParams
  const localeValue = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale
  const locale = isLocale(localeValue) ? localeValue : defaultLocale
  const copy = loginCopy[locale]
  const nextLocale = locale === "ko" ? "en" : "ko"

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 dark:bg-zinc-900 dark:border dark:border-zinc-800">
        <div className="-mb-2 flex justify-end">
          <Link
            href={`/login?locale=${nextLocale}`}
            hrefLang={nextLocale}
            aria-label={copy.languageLabel}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-xs font-black uppercase tracking-widest text-gray-500 transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-900 dark:hover:text-blue-400"
          >
            {nextLocale}
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Logo size={56} showText={false} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-1 dark:text-blue-400">Flip &amp; Flow</h1>
            <p className="text-gray-500 text-sm">{copy.tagline}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <SignInButton label={copy.google} />
          <AppleSignInButton label={copy.apple} />
        </div>
        {reviewerLoginEnabled && (
          <ReviewerSignInButton
            title={copy.reviewerTitle}
            description={copy.reviewerDescription}
            buttonLabel={copy.reviewerButton}
          />
        )}
        <Link
          href={`https://dycdyp.com/${locale}`}
          className="text-center text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
        >
          {copy.intro}
        </Link>
      </div>
    </main>
  )
}
