"use client"

import { useEffect, useMemo, useState } from "react"
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
  controlsPosition?: "top" | "bottom"
}

export default function CardSlider({ cards, controlsPosition = "bottom" }: CardSliderProps) {
  const [shuffled, setShuffled] = useState<Card[]>(cards)
  const [[index, direction], setPage] = useState([0, 0])

  useEffect(() => {
    // shuffle only when the set of cards changes (mount, add/remove) —
    // ignore cards reference changes from server revalidation (e.g. bookmark toggle)
    // so the deck doesn't reshuffle and skip mid-session.
    // Math.random would mismatch between SSR and CSR, so this stays in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffled(shuffle(cards))
    setPage([0, 0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  const paginate = (newDirection: number) => {
    const next = index + newDirection
    if (next < 0 || next >= shuffled.length) return
    setPage([next, newDirection])
  }

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    setPage([0, 0])
  }

  // Look up the latest card object by id so server revalidations
  // (e.g. bookmark toggle) propagate without breaking the shuffled order.
  const cardById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])
  const shuffledCard = shuffled[index]
  const card = (shuffledCard && cardById.get(shuffledCard.id)) ?? shuffledCard

  const controls = (
    <>
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

      <div className="h-1 bg-gray-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / shuffled.length) * 100}%` }}
        />
      </div>
    </>
  )

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

      {controlsPosition === "top" && <div className="flex flex-col gap-3">{controls}</div>}

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
              front={card.front}
              back={card.back}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {controlsPosition === "bottom" && controls}
    </div>
  )
}
