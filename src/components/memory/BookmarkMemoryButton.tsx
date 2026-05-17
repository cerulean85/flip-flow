"use client"

import { useState, useTransition } from "react"
import { Bookmark } from "lucide-react"
import { toggleBookmarkMemoryItem } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  itemId: string
  isBookmarked: boolean
}

export default function BookmarkMemoryButton({ itemId, isBookmarked }: Props) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const label = isBookmarked ? messages.memory.unbookmark : messages.memory.bookmark

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setError(null)
          startTransition(async () => {
            try {
              await toggleBookmarkMemoryItem(itemId)
            } catch (err) {
              console.error(err)
              setError(messages.memory.bookmarkError)
            }
          })
        }}
        disabled={isPending}
        aria-label={label}
        title={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-amber-500 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Bookmark
          size={18}
          className={isBookmarked ? "fill-amber-400 text-amber-400" : ""}
          aria-hidden="true"
        />
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
