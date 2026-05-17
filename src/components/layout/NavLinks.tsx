"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers, BookOpen, Star, NotebookPen, BookMarked, Settings, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

const links: { href: string; key: keyof ReturnType<typeof useLocale>["messages"]["nav"]; Icon: LucideIcon }[] = [
  { href: "/study", key: "study", Icon: BookOpen },
  { href: "/dashboard", key: "decks", Icon: Layers },
  { href: "/bookmarks", key: "bookmarks", Icon: Star },
  { href: "/essays", key: "essays", Icon: NotebookPen },
  { href: "/memory", key: "memory", Icon: BookMarked },
  { href: "/settings", key: "settings", Icon: Settings },
]

interface Props {
  onNavigate?: () => void
  collapsed?: boolean
}

export default function NavLinks({ onNavigate, collapsed = false }: Props) {
  const pathname = usePathname()
  const { messages } = useLocale()

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, key, Icon }) => {
        const label = messages.nav[key]
        const isActive = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-label={collapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2" : "gap-3 px-3",
              isActive
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {!collapsed && label}
          </Link>
        )
      })}
    </nav>
  )
}
