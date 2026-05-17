"use client"

import { useState, useTransition } from "react"
import { unstable_rethrow } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteCard } from "@/actions/card.actions"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  cardId: string
  deckId: string
}

export default function DeleteCardButton({ cardId, deckId }: Props) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => {
          setError(null)
          startTransition(async () => {
            try {
              await deleteCard(cardId, deckId)
            } catch (err) {
              unstable_rethrow(err)
              console.error(err)
              setError(messages.card.deleteError)
            }
          })
        }}
        disabled={isPending}
        className="text-gray-300 hover:text-red-400 disabled:opacity-50 transition-colors dark:text-zinc-600"
        aria-label={messages.card.delete}
      >
        <Trash2 size={14} aria-hidden="true" />
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
