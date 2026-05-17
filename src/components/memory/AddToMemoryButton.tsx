"use client"

import Link from "next/link"
import { BookmarkPlus } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  essayId?: string
  cardId?: string
  deckId?: string
  title?: string
  meaning?: string
  contextText?: string
  type?: "WORD" | "PHRASE" | "SENTENCE" | "GRAMMAR_PATTERN"
  variant?: "primary" | "ghost"
  size?: "sm" | "md"
}

export default function AddToMemoryButton({
  essayId,
  cardId,
  deckId,
  title,
  meaning,
  contextText,
  type,
  variant = "ghost",
  size = "md",
}: Props) {
  const { messages } = useLocale()

  const SHORT_MAX = 200
  const CONTEXT_MAX = 400
  const truncate = (value: string, max: number) =>
    value.length > max ? value.slice(0, max) : value

  const params = new URLSearchParams()
  if (essayId) params.set("essayId", essayId)
  if (cardId) params.set("cardId", cardId)
  if (deckId) params.set("deckId", deckId)
  if (title) params.set("title", truncate(title, SHORT_MAX))
  if (meaning) params.set("meaning", truncate(meaning, SHORT_MAX))
  if (contextText) params.set("contextText", truncate(contextText, CONTEXT_MAX))
  if (type) params.set("type", type)

  const href = `/memory/new?${params.toString()}`

  const baseClasses =
    "inline-flex items-center gap-1.5 rounded-xl font-medium leading-none transition-colors"
  const sizeClasses = size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm"
  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 dark:hover:text-blue-300"

  return (
    <Link href={href} className={`${baseClasses} ${sizeClasses} ${variantClasses}`}>
      <BookmarkPlus size={size === "sm" ? 14 : 16} aria-hidden="true" />
      <span>{messages.memory.addToMemory}</span>
    </Link>
  )
}
