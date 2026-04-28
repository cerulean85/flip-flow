"use client"

import { useEffect, useState } from "react"
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
  const [shuffled, setShuffled] = useState<Card[]>(cards)
  const [reversed, setReversed] = useState<boolean[]>(() => cards.map(() => false))
  const [[index, direction], setPage] = useState([0, 0])

  useEffect(() => {
    setShuffled(shuffle(cards))
    setReversed(cards.map(() => Math.random() < 0.5))
  }, [cards])

  const paginate = (newDirection: number) => {
    const next = index + newDirection
    if (next < 0 || next >= shuffled.length) return
    setPage([next, newDirection])
  }

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    setReversed(cards.map(() => Math.random() < 0.5))
    setPage([0, 0])
  }

  const card = shuffled[index]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 font-medium dark:text-gray-500">
          {index + 1} / {shuffled.length}
        </p>
        <button
          onClick={reshuffle}
          className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors dark:hover:text-indigo-300"
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
            <FlipCard
              key={card.id}
              front={reversed[index] ? card.back : card.front}
              back={reversed[index] ? card.front : card.back}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => paginate(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 disabled:text-gray-300 transition-colors dark:text-indigo-400 dark:disabled:text-gray-700"
        >
          ← 이전
        </button>

        <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />

        <button
          onClick={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 disabled:text-gray-300 transition-colors dark:text-indigo-400 dark:disabled:text-gray-700"
        >
          다음 →
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / shuffled.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
