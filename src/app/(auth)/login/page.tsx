import SignInButton from "@/components/auth/SignInButton"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-1">Flip &amp; Flow</h1>
          <p className="text-gray-500 text-sm">복잡함은 덜어내고, 암기의 흐름만 남기다.</p>
        </div>
        <SignInButton />
      </div>
    </main>
  )
}
