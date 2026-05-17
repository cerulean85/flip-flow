"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import type { MemoryItemType } from "@/generated/prisma/enums"
import {
  createMemoryItem,
  updateMemoryItem,
  type MemoryFormErrorCode,
  type MemoryFormState,
} from "@/actions/memory.actions"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  itemId?: string
  defaultValues?: {
    title: string
    type: MemoryItemType
    meaning: string | null
    explanation: string | null
    example: string | null
    contextText: string | null
  }
  source?: {
    cardId?: string
    essayId?: string
  }
}

const TYPE_OPTIONS: MemoryItemType[] = ["WORD", "PHRASE", "SENTENCE", "GRAMMAR_PATTERN"]

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

export default function MemoryForm({ itemId, defaultValues, source }: Props) {
  const { messages } = useLocale()
  const t = messages.memory

  const action = itemId ? updateMemoryItem.bind(null, itemId) : createMemoryItem
  const [state, formAction] = useActionState<MemoryFormState, FormData>(action, null)
  const cancelHref = itemId ? `/memory/${itemId}` : "/memory"

  const errorMessage = state?.errorCode
    ? t.form.errors[state.errorCode as MemoryFormErrorCode]
    : null

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {source?.cardId && <input type="hidden" name="cardId" value={source.cardId} />}
      {source?.essayId && <input type="hidden" name="essayId" value={source.essayId} />}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.typeLabel}
        </label>
        <select
          name="type"
          defaultValue={defaultValues?.type ?? "WORD"}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {TYPE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t.typeLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.titleLabel}
        </label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          placeholder={t.form.titlePlaceholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.meaningLabel}
        </label>
        <textarea
          name="meaning"
          rows={2}
          defaultValue={defaultValues?.meaning ?? ""}
          placeholder={t.form.meaningPlaceholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.exampleLabel}
        </label>
        <textarea
          name="example"
          rows={2}
          defaultValue={defaultValues?.example ?? ""}
          placeholder={t.form.examplePlaceholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.explanationLabel}
        </label>
        <textarea
          name="explanation"
          rows={3}
          defaultValue={defaultValues?.explanation ?? ""}
          placeholder={t.form.explanationPlaceholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {t.form.contextLabel}
        </label>
        <textarea
          name="contextText"
          rows={2}
          defaultValue={defaultValues?.contextText ?? ""}
          placeholder={t.form.contextPlaceholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Link
          href={cancelHref}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          {t.form.cancel}
        </Link>
        <SubmitButton label={t.form.save} pendingLabel={t.form.saving} />
      </div>
    </form>
  )
}
