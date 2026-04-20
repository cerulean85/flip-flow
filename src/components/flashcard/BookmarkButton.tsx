"use client"

import { useOptimistic, useTransition } from "react"
import { toggleBookmark } from "@/actions/card.actions"

interface BookmarkButtonProps {
  cardId: string
  isBookmark: boolean
}

export default function BookmarkButton({ cardId, isBookmark }: BookmarkButtonProps) {
  const [optimisticBookmark, setOptimistic] = useOptimistic(isBookmark)
  const [, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      setOptimistic(!optimisticBookmark)
      await toggleBookmark(cardId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={optimisticBookmark ? "북마크 해제" : "북마크 추가"}
      className="text-2xl transition-transform active:scale-125"
    >
      {optimisticBookmark ? "⭐" : "☆"}
    </button>
  )
}
