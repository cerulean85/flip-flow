"use client"

import { useTransition } from "react"
import { deleteDeck } from "@/actions/deck.actions"

export default function DeleteDeckButton({ deckId }: { deckId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm("이 덱을 삭제하시겠습니까? 모든 카드도 함께 삭제됩니다.")) return
        startTransition(() => deleteDeck(deckId))
      }}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : "덱 삭제"}
    </button>
  )
}
