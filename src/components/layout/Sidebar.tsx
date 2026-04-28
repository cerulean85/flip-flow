"use client"

import Link from "next/link"
import Logo from "@/components/ui/Logo"
import SignOutButton from "@/components/nav/SignOutButton"
import NavLinks from "./NavLinks"
import { cn } from "@/lib/utils"

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
  signOutAction: () => Promise<void>
  onNavigate?: () => void
  className?: string
}

export default function Sidebar({ user, signOutAction, onNavigate, className }: Props) {
  return (
    <aside
      className={cn(
        "h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo size={26} showText={true} className="text-base" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {(user.name || user.image) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-900">
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
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
              )}
              {user.email && (
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        )}

        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <SignOutButton
          signOutAction={signOutAction}
          image={user.image}
          name={user.name}
          compact
        />
      </div>
    </aside>
  )
}
