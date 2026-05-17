"use client"

import { useState, useTransition } from "react"
import { Loader2, Send } from "lucide-react"
import { exportToDeck } from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  itemId: string
  decks: { id: string; title: string }[]
}

export default function ExportToDeckButton({ itemId, decks }: Props) {
  const { messages } = useLocale()
  const t = messages.memory.export
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id ?? "")
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  if (decks.length === 0) {
    return (
      <p className="text-xs italic text-gray-400 dark:text-zinc-500">
        {t.noDeck}
      </p>
    )
  }

  function handleExport() {
    if (!selectedDeckId || isPending) return
    setMessage(null)
    startTransition(async () => {
      try {
        const result = await exportToDeck(itemId, selectedDeckId)
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
      <select
        value={selectedDeckId}
        onChange={(e) => setSelectedDeckId(e.target.value)}
        disabled={isPending}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {decks.map((deck) => (
          <option key={deck.id} value={deck.id}>
            {deck.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleExport}
        disabled={isPending || !selectedDeckId}
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
