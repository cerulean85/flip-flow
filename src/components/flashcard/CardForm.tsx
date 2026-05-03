"use client"

import { useRef } from "react"
import type { KeyboardEvent } from "react"
import { useFormStatus } from "react-dom"
import { createCard } from "@/actions/card.actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? "추가 중..." : "+ 카드 추가"}
    </button>
  )
}

interface CardFormProps {
  deckId: string
  className?: string
}

export default function CardForm({ deckId, className = "mt-6" }: CardFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const submittingRef = useRef(false)

  async function clientAction(formData: FormData) {
    if (submittingRef.current) return

    submittingRef.current = true
    try {
      await createCard(deckId, formData)
      formRef.current?.reset()
    } finally {
      submittingRef.current = false
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || !event.shiftKey) return

    event.preventDefault()
    formRef.current?.requestSubmit()
  }

  return (
    <form
      ref={formRef}
      action={clientAction}
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-3 ${className}`}
    >
      <h2 className="font-semibold text-gray-700 text-sm dark:text-zinc-300">카드 추가</h2>
      <textarea
        name="front"
        required
        placeholder="앞면 (질문)"
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <textarea
        name="back"
        required
        placeholder="뒷면 (답)"
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <SubmitButton />
    </form>
  )
}
