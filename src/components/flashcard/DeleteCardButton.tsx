"use client"

import { useTransition } from "react"
import { deleteCard } from "@/actions/card.actions"

interface Props {
  cardId: string
  deckId: string
}

export default function DeleteCardButton({ cardId, deckId }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => deleteCard(cardId, deckId))}
      disabled={isPending}
      className="text-gray-300 hover:text-red-400 disabled:opacity-50 text-sm transition-colors dark:text-gray-600"
      aria-label="카드 삭제"
    >
      ✕
    </button>
  )
}
