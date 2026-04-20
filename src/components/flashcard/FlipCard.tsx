"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface FlipCardProps {
  front: string
  back: string
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative w-full h-64 cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onClick={() => setIsFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white shadow-md p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-medium">
            앞면
          </p>
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">{front}</p>
          <p className="text-xs text-gray-300 mt-4">탭하여 뒤집기</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-indigo-50 shadow-md p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-medium">
            뒷면
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">{back}</p>
        </div>
      </motion.div>
    </div>
  )
}
