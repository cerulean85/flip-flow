"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Logo from "@/components/ui/Logo"
import SignOutButton from "@/components/nav/SignOutButton"
import AdSlot from "@/components/ads/AdSlot"
import NavLinks from "./NavLinks"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
  signOutAction: () => Promise<void>
  onNavigate?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export default function Sidebar({
  user,
  signOutAction,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  className,
}: Props) {
  const { messages } = useLocale()

  return (
    <aside
      className={cn(
        "h-full flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-gray-200 dark:border-zinc-800",
          collapsed ? "justify-center px-2" : "justify-between px-3"
        )}
      >
        <Link href="/study" onClick={onNavigate} className="flex items-center min-w-0">
          <Logo size={26} showText={!collapsed} className="text-base" />
        </Link>
        {onToggleCollapse && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={messages.nav.collapse}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {onToggleCollapse && collapsed && (
        <div className="flex justify-center border-b border-gray-200 py-2 dark:border-zinc-800">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={messages.nav.expand}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className={cn("flex-1 overflow-y-auto", collapsed ? "p-2" : "p-4")}>
        {!collapsed && (user.name || user.image) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-zinc-900">
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? "user"}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div className="min-w-0 flex-1">
              {user.name && (
                <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">{user.name}</p>
              )}
              {user.email && (
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        )}
        {collapsed && user.image && (
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image}
              alt={user.name ?? "user"}
              title={user.name ?? undefined}
              className="h-9 w-9 rounded-full"
            />
          </div>
        )}

        <NavLinks onNavigate={onNavigate} collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="px-4 pb-4">
          <AdSlot placement="sidebar" />
        </div>
      )}

      <div className={cn("border-t border-gray-200 dark:border-zinc-800", collapsed ? "p-2" : "p-4")}>
        <SignOutButton
          signOutAction={signOutAction}
          image={user.image}
          name={user.name}
          compact
          collapsed={collapsed}
        />
      </div>
    </aside>
  )
}
