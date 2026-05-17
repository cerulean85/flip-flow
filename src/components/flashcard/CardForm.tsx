"use client"

import { useRef } from "react"
import type { KeyboardEvent } from "react"
import { useFormStatus } from "react-dom"
import { createCard } from "@/actions/card.actions"
import { useLocale } from "@/components/LocaleProvider"

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

interface CardFormProps {
  defaultCategory?: string | null
  className?: string
}

export default function CardForm({ defaultCategory, className = "mt-6" }: CardFormProps) {
  const { messages } = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const submittingRef = useRef(false)

  async function clientAction(formData: FormData) {
    if (submittingRef.current) return

    submittingRef.current = true
    try {
      await createCard(formData)
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
      <h2 className="font-semibold text-gray-700 text-sm dark:text-zinc-300">
        {messages.card.addTitle}
      </h2>
      <input
        name="category"
        defaultValue={defaultCategory ?? ""}
        placeholder={messages.card.categoryPlaceholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <textarea
        name="front"
        required
        placeholder={messages.card.frontPlaceholder}
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <textarea
        name="back"
        required
        placeholder={messages.card.backPlaceholder}
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <SubmitButton label={messages.card.add} pendingLabel={messages.card.adding} />
    </form>
  )
}
