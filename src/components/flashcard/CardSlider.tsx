"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Shuffle, ChevronLeft, ChevronRight, Repeat2 } from "lucide-react"
import AdSlot from "@/components/ads/AdSlot"
import FlipCard from "./FlipCard"
import BookmarkButton from "./BookmarkButton"
import type { Card } from "@/generated/prisma/client"
import { useLocale } from "@/components/LocaleProvider"
import { updateCard } from "@/actions/card.actions"

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
  const { messages } = useLocale()
  const [shuffled, setShuffled] = useState<Card[]>(cards)
  const [editedCards, setEditedCards] = useState<Record<string, Pick<Card, "front" | "back">>>({})
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [studyBackFirst, setStudyBackFirst] = useState(false)
  const [[index, direction], setPage] = useState([0, 0])
  const [isSaving, startSaving] = useTransition()
  const initializedRef = useRef(false)
  const visibleCards = useMemo(
    () => cards.map((card) => ({ ...card, ...editedCards[card.id] })),
    [cards, editedCards]
  )

  useEffect(() => {
    // Math.random would mismatch between SSR and CSR, so the initial shuffle stays in an effect.
    if (!initializedRef.current) {
      initializedRef.current = true
      setShuffled(shuffle(visibleCards))
      setPage([0, 0])
      return
    }

    const currentCardId = shuffled[index]?.id
    const latestCardById = new Map(visibleCards.map((card) => [card.id, card]))
    const keptCards = shuffled
      .map((card) => latestCardById.get(card.id))
      .filter((card): card is Card => Boolean(card))
    const keptCardIds = new Set(keptCards.map((card) => card.id))
    const addedCards = visibleCards.filter((card) => !keptCardIds.has(card.id))
    const nextShuffled = [...keptCards, ...shuffle(addedCards)]
    const nextIndex = Math.max(
      0,
      currentCardId ? nextShuffled.findIndex((card) => card.id === currentCardId) : 0
    )

    setShuffled(nextShuffled)
    setPage([nextIndex, 0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCards.length])

  const paginate = (newDirection: number) => {
    const next = index + newDirection
    if (next < 0 || next >= shuffled.length) return
    setEditingCardId(null)
    setPage([next, newDirection])
  }

  const reshuffle = () => {
    setEditingCardId(null)
    setShuffled(shuffle(visibleCards))
    setPage([0, 0])
  }

  // Look up the latest card object by id so server revalidations
  // (e.g. bookmark toggle) propagate without breaking the shuffled order.
  const cardById = useMemo(() => new Map(visibleCards.map((c) => [c.id, c])), [visibleCards])
  const shuffledCard = shuffled[index]
  const card = (shuffledCard && cardById.get(shuffledCard.id)) ?? shuffledCard
  const studyFront = studyBackFirst ? card.back : card.front
  const studyBack = studyBackFirst ? card.front : card.back

  const saveCard = (formData: FormData) => {
    const front = (formData.get("front") as string).trim()
    const back = (formData.get("back") as string).trim()
    if (!front || !back) return

    startSaving(async () => {
      const updatedCard = await updateCard(card.id, card.deckId, formData)
      setEditedCards((current) => ({
        ...current,
        [updatedCard.id]: { front: updatedCard.front, back: updatedCard.back },
      }))
      setEditingCardId(null)
    })
  }

  const toggleStudySide = () => {
    setEditingCardId(null)
    setStudyBackFirst((current) => !current)
  }

  const controls = (
    <>
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => paginate(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:text-gray-300 transition-colors dark:text-blue-400 dark:disabled:text-zinc-700"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          {messages.card.previous}
        </button>

        <div className="flex items-center gap-1">
          <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:text-gray-300 transition-colors dark:text-blue-400 dark:disabled:text-zinc-700"
        >
          {messages.card.next}
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleStudySide}
            aria-pressed={studyBackFirst}
            aria-label={messages.card.toggleStudySide}
            title={messages.card.toggleStudySide}
            className="inline-flex min-h-8 items-center gap-1 rounded-xl border border-blue-100 px-2.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Repeat2 size={14} aria-hidden="true" />
            {studyBackFirst ? messages.card.studyBackFirst : messages.card.studyFrontFirst}
          </button>
          <button
            onClick={reshuffle}
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 transition-colors dark:hover:text-blue-300"
          >
            <Shuffle size={14} aria-hidden="true" />
            {messages.card.reshuffle}
          </button>
        </div>
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
            {editingCardId === card.id ? (
              <form
                action={saveCard}
                className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-md dark:border-blue-900 dark:bg-zinc-900"
              >
                <textarea
                  name="front"
                  defaultValue={card.front}
                  required
                  rows={3}
                  placeholder={messages.card.frontPlaceholder}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <textarea
                  name="back"
                  defaultValue={card.back}
                  required
                  rows={4}
                  placeholder={messages.card.backPlaceholder}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCardId(null)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    {messages.essay.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? messages.deck.saving : messages.deck.save}
                  </button>
                </div>
              </form>
            ) : (
              <FlipCard
                key={`${card.id}-${studyBackFirst ? "back" : "front"}`}
                deckId={card.deckId}
                front={studyFront}
                back={studyBack}
                onEdit={() => setEditingCardId(card.id)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {controlsPosition === "bottom" && controls}

      <AdSlot placement="study" className="hidden md:block" />
    </div>
  )
}
