"use client"

import { useState, useTransition } from "react"
import { unstable_rethrow } from "next/navigation"
import { deleteMemoryItem } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function DeleteMemoryButton({ itemId }: { itemId: string }) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (!confirm(messages.memory.deleteConfirm)) return
          setError(null)
          startTransition(async () => {
            try {
              await deleteMemoryItem(itemId)
            } catch (err) {
              unstable_rethrow(err)
              console.error(err)
              setError(messages.memory.deleteError)
            }
          })
        }}
        disabled={isPending}
        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? messages.memory.deleting : messages.memory.delete}
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
