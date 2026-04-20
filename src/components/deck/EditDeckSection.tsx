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
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">덱 수정</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
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
      className="text-gray-400 hover:text-indigo-400 text-sm transition-colors"
      aria-label="덱 수정"
    >
      ✎
    </button>
  )
}
