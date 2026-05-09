"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  signOutAction: () => Promise<void>
  image?: string | null
  name?: string | null
  compact?: boolean
  collapsed?: boolean
}

export default function SignOutButton({ signOutAction, image, name, compact = false, collapsed = false }: Props) {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <>
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          title={collapsed ? messages.auth.signOut : undefined}
          aria-label={collapsed ? messages.auth.signOut : undefined}
          className={cn(
            "flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
            collapsed ? "justify-center px-2" : "gap-2 px-3"
          )}
        >
          <LogOut size={18} aria-hidden="true" />
          {!collapsed && messages.auth.signOut}
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200"
        >
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name ?? "user"} className="w-7 h-7 rounded-full" />
          )}
          <span className="hidden sm:inline">{name}</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl flex flex-col gap-4 dark:bg-zinc-900 dark:border dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="font-semibold text-gray-800 dark:text-zinc-100">
                {messages.auth.signOutConfirmTitle}
              </p>
              <p className="text-sm text-gray-500 mt-1 dark:text-zinc-400">
                {messages.auth.signOutConfirmBody}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {messages.auth.cancel}
              </button>
              <form action={signOutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {messages.auth.signOut}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
