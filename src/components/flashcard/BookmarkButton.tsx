"use client"

import { useOptimistic, useTransition } from "react"
import { Star } from "lucide-react"
import { toggleBookmark } from "@/actions/card.actions"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

interface BookmarkButtonProps {
  cardId: string
  isBookmark: boolean
}

export default function BookmarkButton({ cardId, isBookmark }: BookmarkButtonProps) {
  const { messages } = useLocale()
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
      aria-label={optimisticBookmark ? messages.card.unbookmark : messages.card.bookmark}
      className="transition-transform active:scale-125"
    >
      <Star
        size={28}
        className={cn(
          "transition-colors",
          optimisticBookmark
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-zinc-600"
        )}
      />
    </button>
  )
}
