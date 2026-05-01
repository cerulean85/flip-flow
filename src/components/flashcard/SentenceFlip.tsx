"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface Props {
  ko: string
  en: string
}

export default function SentenceFlip({ ko, en }: Props) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label="문장 뒤집기"
      className="block w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm leading-relaxed transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <span
          style={{ gridArea: "1 / 1", backfaceVisibility: "hidden" }}
          className="text-gray-800 dark:text-zinc-200"
        >
          {ko}
        </span>
        <span
          style={{ gridArea: "1 / 1", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="text-blue-700 dark:text-blue-300"
        >
          {en}
        </span>
      </motion.div>
    </button>
  )
}
