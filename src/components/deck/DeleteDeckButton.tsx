"use client"

import { useTransition } from "react"
import { deleteDeck } from "@/actions/deck.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function DeleteDeckButton({ deckId }: { deckId: string }) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm(messages.deck.deleteConfirm)) return
        startTransition(() => deleteDeck(deckId))
      }}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? messages.deck.deleting : messages.deck.delete}
    </button>
  )
}
