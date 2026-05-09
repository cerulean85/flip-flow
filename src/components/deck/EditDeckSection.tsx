"use client"

import { useState } from "react"
import { Pencil, X } from "lucide-react"
import DeckForm from "./DeckForm"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  deckId: string
  title: string
  description: string
  color: string
}

export default function EditDeckSection({ deckId, title, description, color }: Props) {
  const { messages } = useLocale()
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4 dark:bg-zinc-900 dark:border dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
            {messages.deck.editTitle}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <X size={14} aria-hidden="true" />
            {messages.essay.cancel}
          </button>
        </div>
        <DeckForm
          deckId={deckId}
          defaultValues={{ title, description, color }}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      aria-label={messages.deck.editTitle}
      title={messages.deck.editTitle}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:text-zinc-500 dark:hover:text-blue-400 dark:hover:bg-blue-950"
    >
      <Pencil size={14} aria-hidden="true" />
    </button>
  )
}
