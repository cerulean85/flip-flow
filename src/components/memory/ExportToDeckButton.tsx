"use client"

import { useState, useTransition } from "react"
import { Loader2, Send } from "lucide-react"
import { exportToVocabulary } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  itemId: string
}

export default function ExportToVocabularyButton({ itemId }: Props) {
  const { messages } = useLocale()
  const t = messages.memory.export
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  function handleExport() {
    if (isPending) return
    setMessage(null)
    startTransition(async () => {
      try {
        const result = await exportToVocabulary(itemId)
        setMessage({
          type: "ok",
          text: result.alreadyExported ? t.alreadyExported : t.success,
        })
      } catch (err) {
        console.error(err)
        setMessage({
          type: "error",
          text: t.error,
        })
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleExport}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
        {isPending ? t.exporting : t.export}
      </button>
      {message && (
        <span
          className={
            message.type === "ok"
              ? "text-xs text-emerald-600 dark:text-emerald-400"
              : "text-xs text-red-500"
          }
          role={message.type === "error" ? "alert" : undefined}
        >
          {message.text}
        </span>
      )}
    </div>
  )
}
