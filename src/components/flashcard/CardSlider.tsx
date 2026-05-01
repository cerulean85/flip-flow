"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Shuffle, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [reversedMap, setReversedMap] = useState<Record<string, boolean>>({})
  const [[index, direction], setPage] = useState([0, 0])

  useEffect(() => {
    // shuffle/reverse on mount only — Math.random would mismatch between SSR and CSR
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffled(shuffle(cards))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReversedMap(
      Object.fromEntries(cards.map((c) => [c.id, Math.random() < 0.5]))
    )
  }, [cards])

  const paginate = (newDirection: number) => {
    const next = index + newDirection
    if (next < 0 || next >= shuffled.length) return
    setPage([next, newDirection])
  }

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    setReversedMap(
      Object.fromEntries(cards.map((c) => [c.id, Math.random() < 0.5]))
    )
    setPage([0, 0])
  }

  const card = shuffled[index]
  const isReversed = reversedMap[card.id] ?? false

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 font-medium dark:text-zinc-500">
          {index + 1} / {shuffled.length}
        </p>
        <button
          onClick={reshuffle}
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 transition-colors dark:hover:text-blue-300"
        >
          <Shuffle size={14} aria-hidden="true" />
          다시 섞기
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
              front={isReversed ? card.back : card.front}
              back={isReversed ? card.front : card.back}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => paginate(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:text-gray-300 transition-colors dark:text-blue-400 dark:disabled:text-zinc-700"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          이전
        </button>

        <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />

        <button
          onClick={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:text-gray-300 transition-colors dark:text-blue-400 dark:disabled:text-zinc-700"
        >
          다음
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / shuffled.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
