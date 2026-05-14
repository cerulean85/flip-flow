"use client"

import { signIn } from "next-auth/react"

type Props = {
  label?: string
}

export default function AppleSignInButton({ label = "Apple로 로그인" }: Props) {
  return (
    <button
      onClick={() => signIn("apple", { callbackUrl: "/study" })}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-1.06.396-2.2 1.077-2.99.84-.94 2.232-1.66 3.087-1.66zM20.5 17.42c-.43 1-.643 1.45-1.207 2.32-.79 1.22-1.91 2.74-3.297 2.76-1.232.02-1.55-.8-3.225-.79-1.677.01-2.022.81-3.255.79-1.387-.02-2.448-1.39-3.238-2.61C4.41 16.8 4.18 11.4 5.83 9c1.225-1.78 3.16-2.83 4.97-2.83 1.84 0 3 .98 4.523.98 1.475 0 2.376-.98 4.515-.98 1.62 0 3.336.88 4.557 2.4-4.005 2.19-3.353 7.92-1.895 8.85z" />
      </svg>
      {label}
    </button>
  )
}
