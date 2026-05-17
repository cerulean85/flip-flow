"use client"

import { useState, useTransition } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { enrichWithAI } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function AIEnrichButton({ itemId }: { itemId: string }) {
  const { messages } = useLocale()
  const t = messages.memory.ai
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            setError(null)
            try {
              await enrichWithAI(itemId)
            } catch (err) {
              console.error(err)
              setError(t.error)
            }
          })
        }
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles size={16} aria-hidden="true" />
        )}
        {isPending ? t.enriching : t.enrich}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
