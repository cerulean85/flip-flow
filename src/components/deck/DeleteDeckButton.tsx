"use client"

import { useState, useTransition } from "react"
import { unstable_rethrow } from "next/navigation"
import { deleteDeck } from "@/actions/deck.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function DeleteDeckButton({ deckId }: { deckId: string }) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (!confirm(messages.deck.deleteConfirm)) return
          setError(null)
          startTransition(async () => {
            try {
              await deleteDeck(deckId)
            } catch (err) {
              unstable_rethrow(err)
              console.error(err)
              setError(messages.deck.deleteError)
            }
          })
        }}
        disabled={isPending}
        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? messages.deck.deleting : messages.deck.delete}
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
