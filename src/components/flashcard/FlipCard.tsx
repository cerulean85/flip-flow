"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"

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
            className="flex flex-col items-center justify-center rounded-2xl bg-white shadow-md p-6 pb-10 text-center min-h-40 dark:bg-gray-900 dark:border dark:border-gray-800"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", willChange: "transform" }}
          >

            <p className="text-xl font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap w-full dark:text-gray-100">
              {front}
            </p>
            <p className="text-xs text-gray-300 mt-4 dark:text-gray-600">탭하여 뒤집기</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:text-indigo-300 dark:hover:bg-indigo-950"
            >
              {isSearching ? (
                <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                "🔍"
              )}
              뜻 검색
            </button>
          </div>

          {/* Back */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50 shadow-md p-6 pb-10 text-center min-h-40 dark:bg-indigo-950"
            style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", transform: "rotateY(180deg)", willChange: "transform" }}
          >

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap w-full dark:text-gray-100">{back}</p>
            <p className="text-xs text-gray-300 mt-4 dark:text-gray-500">탭하여 뒤집기</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:text-indigo-300 dark:hover:bg-indigo-900"
            >
              {isSearching ? (
                <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                "🔍"
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
            className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4 dark:from-indigo-950 dark:to-purple-950 dark:border-indigo-900"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest dark:text-indigo-400">
                ✨ AI 검색 결과
              </p>
              <button
                onClick={() => setShowResult(false)}
                className="text-gray-300 hover:text-gray-500 text-sm transition-colors dark:text-gray-600 dark:hover:text-gray-400"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  h1: ({ children }) => <h1 className="text-base font-bold text-gray-900 mb-1 dark:text-gray-100">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold text-gray-900 mb-1 dark:text-gray-100">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-800 mb-1 dark:text-gray-200">{children}</h3>,
                  code: ({ children }) => <code className="bg-indigo-100 text-indigo-700 rounded px-1 py-0.5 text-xs font-mono dark:bg-indigo-900 dark:text-indigo-300">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-300 pl-3 text-gray-500 italic my-1 dark:border-indigo-700">{children}</blockquote>,
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
