"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Loader2, Plus, Volume2 } from "lucide-react"
import { createCardFromSentence } from "@/actions/card.actions"
import { speak } from "@/lib/speech"

interface Props {
  deckId: string
  ko: string
  en: string
}

export default function SentenceFlip({ deckId, ko, en }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const visibleSentence = flipped ? ko : en
  const visibleLocale = flipped ? "ko-KR" : "en-US"

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1400)
    return () => window.clearTimeout(timeout)
  }, [copied])

  useEffect(() => {
    if (!saved) return
    const timeout = window.setTimeout(() => setSaved(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [saved])

  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(null), 2200)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(visibleSentence, visibleLocale)
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(visibleSentence)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const handleCreateCard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saving) return

    setSaving(true)
    try {
      const result = await createCardFromSentence(deckId, { en, ko })
      setSaved(true)
      setToastMessage(`"${result.deckTitle}" 덱에 추가했어요.`)
    } finally {
      setSaving(false)
    }
  }

  const toggle = () => setFlipped((f) => !f)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
        }}
        aria-label="문장 뒤집기"
        className="relative flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-sm leading-relaxed transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
        style={{ perspective: "800px" }}
      >
        <motion.div
          className="grid min-w-0 flex-1"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <span
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden" }}
            className="text-left text-blue-700 dark:text-blue-300"
          >
            {en}
          </span>
          <span
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="text-left text-gray-800 dark:text-zinc-200"
          >
            {ko}
          </span>
        </motion.div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleCreateCard}
            disabled={saving}
            aria-label={saved ? "카드에 추가됨" : "카드에 추가"}
            title={saved ? "카드에 추가됨" : "카드에 추가"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : saved ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "복사됨" : "문장 복사"}
            title={copied ? "복사됨" : "문장 복사"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={handleSpeak}
            aria-label="읽기"
            title="읽기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Volume2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
        >
          {toastMessage}
        </div>
      )}
    </>
  )
}
