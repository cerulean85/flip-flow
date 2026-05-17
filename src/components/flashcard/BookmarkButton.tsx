"use client"

import { useOptimistic, useState, useTransition } from "react"
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
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      setOptimistic(!optimisticBookmark)
      try {
        await toggleBookmark(cardId)
      } catch (err) {
        console.error(err)
        // optimistic state automatically reverts when the transition ends without a successful mutation;
        // surface a hint so the user knows the toggle did not persist.
        setError(messages.card.bookmarkError)
      }
    })
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
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
      {error && (
        <span className="text-[10px] text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
