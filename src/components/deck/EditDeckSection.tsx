"use client"

import { useState } from "react"
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
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4 dark:bg-gray-900 dark:border dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">덱 수정</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors dark:text-gray-500 dark:hover:text-gray-300"
          >
            ✕ 취소
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
      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors dark:text-gray-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-950"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
  )
}
