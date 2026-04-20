"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/dashboard", label: "Decks", icon: "🗂" },
  { href: "/bookmarks", label: "Bookmarks", icon: "⭐" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 max-w-md mx-auto">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
            pathname.startsWith(link.href)
              ? "text-indigo-600"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <span className="text-xl">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
