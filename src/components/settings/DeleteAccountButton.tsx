"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteAccount } from "@/actions/account.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function DeleteAccountButton() {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText.trim() === messages.settings.deleteConfirmPhrase

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
        setError(err instanceof Error ? err.message : messages.settings.deleteError)
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
        {messages.settings.deleteButton}
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
              <p className="text-base font-semibold text-gray-900 dark:text-zinc-100">
                {messages.settings.deleteDialogTitle}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                {messages.settings.deleteDialogBody}
              </p>
            </div>

            <div>
              <label htmlFor="delete-confirm" className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-zinc-300">
                {messages.settings.deleteConfirmLabel}
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isPending}
                autoComplete="off"
                placeholder={messages.settings.deleteConfirmPhrase}
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
                {messages.settings.cancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || !isConfirmed}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? messages.settings.deleting : messages.settings.deleteConfirmPhrase}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
