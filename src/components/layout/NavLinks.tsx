"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers, BookOpen, Star, NotebookPen, Settings, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const links: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/dashboard", label: "덱", Icon: Layers },
  { href: "/study", label: "전체 학습", Icon: BookOpen },
  { href: "/bookmarks", label: "북마크", Icon: Star },
  { href: "/essays", label: "에세이", Icon: NotebookPen },
  { href: "/settings", label: "설정", Icon: Settings },
]

interface Props {
  onNavigate?: () => void
}

export default function NavLinks({ onNavigate }: Props) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
