"use client"

import { useState } from "react"
import { Pencil, X } from "lucide-react"
import DeckForm from "./DeckForm"

interface Props {
  deckId: string
  title: string
  description: string
  color: string
}

export default function EditDeckSection({ deckId, title, description, color }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4 dark:bg-zinc-900 dark:border dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">덱 수정</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <X size={14} aria-hidden="true" />
            취소
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
      aria-label="덱 수정"
      title="덱 수정"
      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:text-zinc-500 dark:hover:text-blue-400 dark:hover:bg-blue-950"
    >
      <Pencil size={14} aria-hidden="true" />
    </button>
  )
}
