"use client"

import { useRef } from "react"
import { useFormStatus } from "react-dom"
import { createCard } from "@/actions/card.actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? "추가 중..." : "+ 카드 추가"}
    </button>
  )
}

interface CardFormProps {
  deckId: string
}

export default function CardForm({ deckId }: CardFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  async function clientAction(formData: FormData) {
    await createCard(deckId, formData)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={clientAction} className="flex flex-col gap-3 mt-6">
      <h2 className="font-semibold text-gray-700 text-sm">카드 추가</h2>
      <input
        name="front"
        required
        placeholder="앞면 (질문)"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        name="back"
        required
        placeholder="뒷면 (답)"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <SubmitButton />
    </form>
  )
}
