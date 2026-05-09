"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquareText, Search, Sparkles } from "lucide-react"
import type { LandingCard } from "@/lib/landing"

const defaultCards: LandingCard[] = [
  {
    front: "resilient",
    pos: "adj.",
    example: "She stays resilient through every change.",
    back: "회복력이 있는",
    note: "다시 튀어 오르는 힘을 묘사할 때",
  },
  {
    front: "pivot",
    pos: "v.",
    example: "We had to pivot the plan halfway.",
    back: "방향을 바꾸다",
    note: "전체 흐름을 옮겨야 할 때 자연스럽게",
  },
  {
    front: "nuance",
    pos: "n.",
    example: "There's a subtle nuance in his tone.",
    back: "미묘한 차이",
    note: "감정·표현의 결을 짚어 말할 때",
  },
  {
    front: "meticulous",
    pos: "adj.",
    example: "Her notes are meticulously kept.",
    back: "꼼꼼한",
    note: "디테일까지 빠짐없이 챙기는 모습에",
  },
]

type Props = {
  cards?: LandingCard[]
  hint?: string
  ariaLabel?: string
  practiceLabel?: string
  definitionLabel?: string
}

export default function LandingFlipCard({
  cards = defaultCards,
  hint = "탭하면 뒤집혀요",
  ariaLabel = "카드 뒤집기",
  practiceLabel = "연습하기",
  definitionLabel = "뜻 검색",
}: Props) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [paused, setPaused] = useState(false)
  const cardCount = cards.length

  useEffect(() => {
    if (paused) return
    const flip = window.setTimeout(() => setIsFlipped(true), 2400)
    const reset = window.setTimeout(() => setIsFlipped(false), 4800)
    const advance = window.setTimeout(
      () => setIndex((i) => (i + 1) % cardCount),
      5400
    )
    return () => {
      clearTimeout(flip)
      clearTimeout(reset)
      clearTimeout(advance)
    }
  }, [cardCount, index, paused])

  useEffect(() => {
    if (!paused) return
    const resume = window.setTimeout(() => setPaused(false), 5000)
    return () => clearTimeout(resume)
  }, [paused])

  const card = cards[index]

  const handleClick = () => {
    setIsFlipped((v) => !v)
    setPaused(true)
  }

  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute -top-11 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-200">
        <Sparkles size={12} aria-hidden="true" />
        {hint}
      </span>
      <button
        type="button"
        aria-label={ariaLabel}
        className="relative block w-full select-none rounded-[1.75rem] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
        style={{ perspective: "1400px" }}
        onClick={handleClick}
      >
        <motion.div
          className="relative grid w-full"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
        >
          <div
            className="flex flex-col justify-between rounded-[1.75rem] border border-white/60 bg-white p-7 shadow-2xl shadow-blue-900/20 dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              gridArea: "1 / 1",
              backfaceVisibility: "hidden",
              minHeight: 320,
              borderRadius: "1.75rem",
            }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                FRONT
              </span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {card.pos}
              </span>
            </div>
            <div>
              <p className="text-4xl font-black leading-none text-zinc-950 sm:text-5xl dark:text-white">
                {card.front}
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {card.example}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <MessageSquareText size={14} aria-hidden="true" />
                {practiceLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Search size={14} aria-hidden="true" />
                {definitionLabel}
              </span>
            </div>
          </div>
          <div
            className="flex flex-col justify-between rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 p-7 shadow-2xl shadow-fuchsia-900/15 dark:border-blue-900 dark:from-blue-950 dark:via-zinc-900 dark:to-fuchsia-950"
            style={{
              gridArea: "1 / 1",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              minHeight: 320,
              borderRadius: "1.75rem",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-300">
                BACK
              </span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {card.pos}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black leading-tight text-zinc-950 sm:text-4xl dark:text-white">
                {card.back}
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {card.note}
              </p>
            </div>
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition ${
                    i === index
                      ? "bg-zinc-950 dark:bg-white"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </button>
    </div>
  )
}
