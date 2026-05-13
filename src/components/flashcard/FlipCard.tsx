"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Search, Sparkles, X, Loader2, MessageSquareText, Pencil, Volume2 } from "lucide-react"
import SentenceFlip from "./SentenceFlip"
import { speak } from "@/lib/speech"
import { useLocale } from "@/components/LocaleProvider"

type Sentence = { ko: string; en: string }

interface FlipCardProps {
  deckId: string
  front: string
  back: string
  onEdit?: () => void
}

export default function FlipCard({ deckId, front, back, onEdit }: FlipCardProps) {
  const { messages } = useLocale()
  const [isFlipped, setIsFlipped] = useState(false)
  const [geminiResult, setGeminiResult] = useState<string | null>(null)
  const [geminiTerm, setGeminiTerm] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const [sentences, setSentences] = useState<Sentence[] | null>(null)
  const [sentencesError, setSentencesError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSentences, setShowSentences] = useState(false)

  const searchMeaning = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSearching) return

    const visibleTerm = isFlipped ? back : front

    if (showResult && geminiResult && geminiTerm === visibleTerm) {
      setShowResult(false)
      return
    }

    setIsSearching(true)
    setShowResult(false)
    setGeminiResult(null)
    setGeminiTerm(visibleTerm)

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: visibleTerm }),
      })
      const data = await res.json()
      setGeminiResult(data.result ?? data.error ?? messages.card.noResult)
    } catch {
      setGeminiResult(messages.card.networkError)
    } finally {
      setIsSearching(false)
      setShowResult(true)
    }
  }

  const generateSentences = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isGenerating) return

    if (showSentences && (sentences || sentencesError)) {
      setShowSentences(false)
      return
    }

    setIsGenerating(true)
    setShowSentences(false)
    setSentences(null)
    setSentencesError(null)

    try {
      const res = await fetch("/api/sentences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, back }),
      })
      const data = await res.json()
      if (Array.isArray(data.sentences) && data.sentences.length > 0) {
        setSentences(data.sentences)
      } else {
        setSentencesError(data.error ?? messages.card.sentenceError)
      }
    } catch {
      setSentencesError(messages.card.networkError)
    } finally {
      setIsGenerating(false)
      setShowSentences(true)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          className="grid w-full"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Front */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl bg-white shadow-md px-6 pb-16 pt-16 text-center min-h-40 dark:bg-zinc-900 dark:border dark:border-zinc-800"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", willChange: "transform" }}
          >
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                aria-label={messages.card.edit}
                title={messages.card.edit}
                className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              >
                <Pencil size={18} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                speak(front)
              }}
              aria-label={messages.card.readFront}
              title={messages.card.readFront}
              className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
              <Volume2 size={18} aria-hidden="true" />
            </button>

            <p className="text-xl font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap w-full dark:text-zinc-100">
              {front}
            </p>
            <p className="text-xs text-gray-300 mt-4 dark:text-zinc-600">{messages.card.tapToFlip}</p>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={generateSentences}
                disabled={isGenerating}
                className="flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <MessageSquareText size={16} aria-hidden="true" />
                )}
                {messages.card.practice}
              </button>
              <button
                onClick={searchMeaning}
                disabled={isSearching}
                className="flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              >
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={16} aria-hidden="true" />
                )}
                {messages.card.definition}
              </button>
            </div>
          </div>

          {/* Back */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 shadow-md px-6 pb-16 pt-16 text-center min-h-40 dark:bg-blue-950"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", transform: "rotateY(180deg)", willChange: "transform" }}
          >
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                aria-label={messages.card.edit}
                title={messages.card.edit}
                className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              >
                <Pencil size={18} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                speak(back)
              }}
              aria-label={messages.card.readBack}
              title={messages.card.readBack}
              className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
            >
              <Volume2 size={18} aria-hidden="true" />
            </button>

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap w-full dark:text-zinc-100">{back}</p>
            <p className="text-xs text-gray-300 mt-4 dark:text-zinc-500">{messages.card.tapToFlip}</p>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={generateSentences}
                disabled={isGenerating}
                className="flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <MessageSquareText size={16} aria-hidden="true" />
                )}
                {messages.card.practice}
              </button>
              <button
                onClick={searchMeaning}
                disabled={isSearching}
                className="flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              >
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={16} aria-hidden="true" />
                )}
                {messages.card.definition}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI result panel */}
      <AnimatePresence>
        {showResult && geminiResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-4 dark:bg-zinc-900 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 uppercase tracking-widest dark:text-blue-400">
                <Sparkles size={12} aria-hidden="true" />
                {messages.card.aiResult}
              </p>
              <button
                onClick={() => setShowResult(false)}
                aria-label={messages.card.close}
                className="text-gray-300 hover:text-gray-500 transition-colors dark:text-zinc-600 dark:hover:text-zinc-400"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed dark:text-zinc-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-zinc-100">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-600 dark:text-zinc-400">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700 dark:text-zinc-300">{children}</li>,
                  h1: ({ children }) => <h1 className="text-base font-bold text-gray-900 mb-1 dark:text-zinc-100">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold text-gray-900 mb-1 dark:text-zinc-100">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-800 mb-1 dark:text-zinc-200">{children}</h3>,
                  code: ({ children }) => <code className="bg-blue-100 text-blue-700 rounded px-1 py-0.5 text-xs font-mono dark:bg-blue-900 dark:text-blue-300">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-300 pl-3 text-gray-500 italic my-1 dark:border-blue-700">{children}</blockquote>,
                }}
              >
                {geminiResult}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice sentences panel */}
      <AnimatePresence>
        {showSentences && (sentences || sentencesError) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-white border border-gray-200 p-4 dark:bg-zinc-900 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 uppercase tracking-widest dark:text-blue-400">
                <MessageSquareText size={12} aria-hidden="true" />
                {messages.card.practice}
              </p>
              <button
                onClick={() => setShowSentences(false)}
                aria-label={messages.card.close}
                className="text-gray-300 hover:text-gray-500 transition-colors dark:text-zinc-600 dark:hover:text-zinc-400"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            {sentencesError ? (
              <p className="text-sm text-red-500 dark:text-red-400">{sentencesError}</p>
            ) : (
              <>
                <p className="mb-2 text-xs text-gray-400 dark:text-zinc-500">
                  {messages.card.practiceHint}
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  {sentences!.map((s, i) => (
                    <li key={i} className="text-sm text-gray-400 dark:text-zinc-600">
                      <span className="inline-block w-[calc(100%-1.5rem)] align-top">
                        <SentenceFlip deckId={deckId} ko={s.ko} en={s.en} />
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
