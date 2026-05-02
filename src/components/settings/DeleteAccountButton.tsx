"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteAccount } from "@/actions/account.actions"

const CONFIRM_PHRASE = "삭제"

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText.trim() === CONFIRM_PHRASE

  const close = () => {
    if (isPending) return
    setOpen(false)
    setConfirmText("")
    setError(null)
  }

  const handleDelete = () => {
    if (!isConfirmed) return
    setError(null)
    startTransition(async () => {
      try {
        await deleteAccount()
      } catch (err) {
        setError(err instanceof Error ? err.message : "계정을 삭제하지 못했습니다.")
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        <Trash2 size={16} aria-hidden="true" />
        계정 삭제
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={close}
        >
          <div
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-zinc-100">계정 삭제</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                계정과 함께 작성하신 모든 덱, 카드, 에세이가 영구적으로 삭제됩니다.
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div>
              <label htmlFor="delete-confirm" className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-zinc-300">
                계속하려면 아래 칸에 <span className="font-semibold text-red-600 dark:text-red-400">삭제</span>를 입력하세요
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isPending}
                autoComplete="off"
                placeholder="삭제"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={close}
                disabled={isPending}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || !isConfirmed}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
