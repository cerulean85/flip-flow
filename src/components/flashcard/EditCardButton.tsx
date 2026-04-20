"use client"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { updateCard } from "@/actions/card.actions"

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "저장 중..." : "저장"}
    </button>
  )
}

interface Props {
  cardId: string
  deckId: string
  front: string
  back: string
}

export default function EditCardButton({ cardId, deckId, front, back }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [, startTransition] = useTransition()

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-300 hover:text-indigo-400 text-sm transition-colors"
        aria-label="카드 수정"
      >
        ✎
      </button>
    )
  }

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      await updateCard(cardId, deckId, formData)
      setIsEditing(false)
    })
  }

  return (
    <form action={clientAction} className="w-full flex flex-col gap-2 mt-2">
      <input
        name="front"
        defaultValue={front}
        required
        placeholder="앞면 (질문)"
        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        name="back"
        defaultValue={back}
        required
        placeholder="뒷면 (답)"
        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="flex gap-2">
        <SaveButton />
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
