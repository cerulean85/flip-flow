"use client"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { Pencil } from "lucide-react"
import { updateCard } from "@/actions/card.actions"

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
        className="text-gray-300 hover:text-blue-400 transition-colors dark:text-zinc-600"
        aria-label="카드 수정"
      >
        <Pencil size={14} aria-hidden="true" />
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
        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <input
        name="back"
        defaultValue={back}
        required
        placeholder="뒷면 (답)"
        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <div className="flex gap-2">
        <SaveButton />
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:border-zinc-700"
        >
          취소
        </button>
      </div>
    </form>
  )
}
