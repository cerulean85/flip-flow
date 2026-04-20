"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import FlipCard from "./FlipCard"
import BookmarkButton from "./BookmarkButton"
import type { Card } from "@/generated/prisma/client"

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CardSliderProps {
  cards: Card[]
}

export default function CardSlider({ cards }: CardSliderProps) {
  const [shuffled, setShuffled] = useState(() => shuffle(cards))
  const [[index, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    const next = index + newDirection
    if (next < 0 || next >= shuffled.length) return
    setPage([next, newDirection])
  }

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    setPage([0, 0])
  }

  const card = shuffled[index]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 font-medium">
          {index + 1} / {shuffled.length}
        </p>
        <button
          onClick={reshuffle}
          className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors"
        >
          🔀 다시 섞기
        </button>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={card.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.22, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <FlipCard key={card.id} front={card.front} back={card.back} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => paginate(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 disabled:text-gray-300 transition-colors"
        >
          ← 이전
        </button>

        <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />

        <button
          onClick={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 disabled:text-gray-300 transition-colors"
        >
          다음 →
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / shuffled.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
