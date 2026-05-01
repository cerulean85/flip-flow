"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Search, Sparkles, X, Loader2 } from "lucide-react"

interface FlipCardProps {
  front: string
  back: string
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [geminiResult, setGeminiResult] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const searchMeaning = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSearching) return

    if (showResult && geminiResult) {
      setShowResult(false)
      return
    }

    setIsSearching(true)
    setShowResult(false)
    setGeminiResult(null)

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: front }),
      })
      const data = await res.json()
      setGeminiResult(data.result ?? data.error ?? "결과를 가져올 수 없습니다.")
    } catch {
      setGeminiResult("네트워크 오류가 발생했습니다.")
    } finally {
      setIsSearching(false)
      setShowResult(true)
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
            className="flex flex-col items-center justify-center rounded-2xl bg-white shadow-md p-6 pb-10 text-center min-h-40 dark:bg-zinc-900 dark:border dark:border-zinc-800"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", willChange: "transform" }}
          >

            <p className="text-xl font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap w-full dark:text-zinc-100">
              {front}
            </p>
            <p className="text-xs text-gray-300 mt-4 dark:text-zinc-600">탭하여 뒤집기</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:text-blue-300 dark:hover:bg-blue-950"
            >
              {isSearching ? (
                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              ) : (
                <Search size={12} aria-hidden="true" />
              )}
              뜻 검색
            </button>
          </div>

          {/* Back */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 shadow-md p-6 pb-10 text-center min-h-40 dark:bg-blue-950"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", transform: "rotateY(180deg)", willChange: "transform" }}
          >

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap w-full dark:text-zinc-100">{back}</p>
            <p className="text-xs text-gray-300 mt-4 dark:text-zinc-500">탭하여 뒤집기</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-blue-100 dark:hover:text-blue-300 dark:hover:bg-blue-900"
            >
              {isSearching ? (
                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              ) : (
                <Search size={12} aria-hidden="true" />
              )}
              뜻 검색
            </button>
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
                AI 검색 결과
              </p>
              <button
                onClick={() => setShowResult(false)}
                aria-label="닫기"
                className="text-gray-300 hover:text-gray-500 transition-colors dark:text-zinc-600 dark:hover:text-zinc-400"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed dark:text-zinc-300">
              <ReactMarkdown
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
    </div>
  )
}
