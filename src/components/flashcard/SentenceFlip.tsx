"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { speak } from "@/lib/speech"

interface Props {
  ko: string
  en: string
}

export default function SentenceFlip({ ko, en }: Props) {
  const [flipped, setFlipped] = useState(false)

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(flipped ? ko : en, flipped ? "ko-KR" : "en-US")
  }

  const toggle = () => setFlipped((f) => !f)

  return (
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

      <button
        type="button"
        onClick={handleSpeak}
        aria-label="읽기"
        title="읽기"
        className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
      >
        <Volume2 size={12} aria-hidden="true" />
      </button>
    </div>
  )
}
