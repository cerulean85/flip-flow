"use client"

import { useTransition } from "react"
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

  return (
    <button
      onClick={() => startTransition(() => deleteCard(cardId, deckId))}
      disabled={isPending}
      className="text-gray-300 hover:text-red-400 disabled:opacity-50 transition-colors dark:text-zinc-600"
      aria-label={messages.card.delete}
    >
      <Trash2 size={14} aria-hidden="true" />
    </button>
  )
}
