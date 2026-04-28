"use client"

import { useFormStatus } from "react-dom"
import { createDeck, updateDeck } from "@/actions/deck.actions"

const COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
]

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

interface DeckFormProps {
  deckId?: string
  defaultValues?: { title: string; description: string; color: string }
  onSuccess?: () => void
}

export default function DeckForm({ deckId, defaultValues, onSuccess }: DeckFormProps) {
  const action = deckId
    ? async (formData: FormData) => { await updateDeck(deckId, formData); onSuccess?.() }
    : createDeck

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">제목 *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          placeholder="덱 이름을 입력하세요"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">설명</label>
        <textarea
          name="description"
          defaultValue={defaultValues?.description}
          placeholder="덱에 대한 설명 (선택)"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">색상</label>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={color === (defaultValues?.color ?? "#6366f1")}
                className="sr-only"
              />
              <span
                className="block w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent transition-all"
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </div>
      <SubmitButton
        label={deckId ? "저장" : "덱 만들기"}
        pendingLabel="저장 중..."
      />
    </form>
  )
}
