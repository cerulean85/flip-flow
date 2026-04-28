"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Decks", icon: "🗂" },
  { href: "/study", label: "전체 학습", icon: "📖" },
  { href: "/bookmarks", label: "Bookmarks", icon: "⭐" },
  { href: "/settings", label: "설정", icon: "⚙️" },
]

interface Props {
  onNavigate?: () => void
}

export default function NavLinks({ onNavigate }: Props) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            <span className="text-lg leading-none">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
