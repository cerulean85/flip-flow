"use client"

import type { MemoryItemType } from "@/generated/prisma/enums"
import { useLocale } from "@/components/LocaleProvider"

const COLOR_BY_TYPE: Record<MemoryItemType, string> = {
  WORD: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  PHRASE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  SENTENCE: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  GRAMMAR_PATTERN: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
}

export default function MemoryTypeBadge({ type }: { type: MemoryItemType }) {
  const { messages } = useLocale()
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_BY_TYPE[type]}`}
    >
      {messages.memory.typeLabels[type]}
    </span>
  )
}
