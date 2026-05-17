"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquareText } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

type Answer = { question: string; answer: string }

const ENRICH_ERROR_CODES = [
  "unauthorized",
  "bad_request",
  "not_found",
  "ai_not_configured",
  "rate_limit_exceeded",
  "ai_request_failed",
] as const
type EnrichErrorCode = (typeof ENRICH_ERROR_CODES)[number]

function isEnrichErrorCode(value: unknown): value is EnrichErrorCode {
  return typeof value === "string" && (ENRICH_ERROR_CODES as readonly string[]).includes(value)
}

const STORAGE_PREFIX = "flip-flow.memory.qa."
const MAX_STORED = 10

function storageKey(itemId: string) {
  return `${STORAGE_PREFIX}${itemId}`
}

function loadStored(itemId: string): Answer[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(storageKey(itemId))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (entry): entry is Answer =>
          typeof entry === "object" &&
          entry !== null &&
          "question" in entry &&
          "answer" in entry &&
          typeof (entry as Answer).question === "string" &&
          typeof (entry as Answer).answer === "string"
      )
      .slice(-MAX_STORED)
  } catch {
    return []
  }
}

function saveStored(itemId: string, answers: Answer[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      storageKey(itemId),
      JSON.stringify(answers.slice(-MAX_STORED))
    )
  } catch {
    // ignore quota / privacy errors
  }
}

export default function AIQuestionForm({ itemId }: { itemId: string }) {
  const { messages } = useLocale()
  const t = messages.memory.ai
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [error, setError] = useState<string | null>(null)

  function resolveError(code: unknown): string {
    if (isEnrichErrorCode(code)) return t.errors[code]
    return t.error
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loadStored(itemId))
  }, [itemId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return
    setIsAsking(true)
    setError(null)
    try {
      const res = await fetch("/api/memory/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, question: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error("AI request failed", res.status, data)
        setError(resolveError(data?.errorCode))
        return
      }
      setAnswers((prev) => {
        const next = [...prev, { question: trimmed, answer: data.answer }]
        saveStored(itemId, next)
        return next
      })
      setQuestion("")
    } catch (err) {
      console.error(err)
      setError(t.error)
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.askPlaceholder}
          maxLength={500}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={isAsking || question.trim().length === 0}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          {isAsking ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <MessageSquareText size={16} aria-hidden="true" />
          )}
          {isAsking ? t.asking : t.ask}
        </button>
      </form>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {answers.length > 0 && (
        <div className="flex flex-col gap-3">
          {answers.map((entry, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-zinc-500">
                Q. {entry.question}
              </p>
              <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-zinc-200">
                {entry.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
