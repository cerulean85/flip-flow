"use client"

import { useState } from "react"

interface Props {
  signOutAction: () => Promise<void>
  image?: string | null
  name?: string | null
  compact?: boolean
}

export default function SignOutButton({ signOutAction, image, name, compact = false }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span className="text-lg leading-none">🚪</span>
          로그아웃
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
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
            className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl flex flex-col gap-4 dark:bg-gray-900 dark:border dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="font-semibold text-gray-800 dark:text-gray-100">로그아웃</p>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">정말 로그아웃 하시겠어요?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <form action={signOutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
