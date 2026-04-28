"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"

interface Props {
  onToggle: () => void
}

export default function TopBar({ onToggle }: Props) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-label="메뉴 열기"
        className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      <Link href="/dashboard" className="flex items-center">
        <Logo size={26} showText={true} className="text-base" />
      </Link>
    </header>
  )
}
