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
        className="relative w-full h-64 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white shadow-md p-6 text-center"
            style={{ backfaceVisibility: "hidden", willChange: "transform" }}
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-medium">
              앞면
            </p>
            <p className="text-xl font-semibold text-gray-800 leading-relaxed">{front}</p>
            <p className="text-xs text-gray-300 mt-4">탭하여 뒤집기</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
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
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-indigo-50 shadow-md p-6 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", willChange: "transform" }}
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-medium">
              뒷면
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">{back}</p>

            <button
              onClick={searchMeaning}
              disabled={isSearching}
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-100"
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

      {/* Gemini result panel */}
      <AnimatePresence>
        {showResult && geminiResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
                ✨ AI 검색 결과
              </p>
              <button
                onClick={() => setShowResult(false)}
                className="text-gray-300 hover:text-gray-500 text-sm transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  h1: ({ children }) => <h1 className="text-base font-bold text-gray-900 mb-1">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold text-gray-900 mb-1">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-800 mb-1">{children}</h3>,
                  code: ({ children }) => <code className="bg-indigo-100 text-indigo-700 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-300 pl-3 text-gray-500 italic my-1">{children}</blockquote>,
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
