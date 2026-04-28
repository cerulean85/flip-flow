import SignInButton from "@/components/auth/SignInButton"
import Logo from "@/components/ui/Logo"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 dark:bg-gray-900 dark:border dark:border-gray-800">
        <div className="flex flex-col items-center gap-3">
          <Logo size={56} showText={false} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600 mb-1 dark:text-indigo-400">Flip &amp; Flow</h1>
            <p className="text-gray-500 text-sm">복잡함은 덜어내고, 암기의 흐름만 남기다.</p>
          </div>
        </div>
        <SignInButton />
      </div>
    </main>
  )
}
