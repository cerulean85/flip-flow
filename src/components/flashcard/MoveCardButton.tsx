"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { moveCard } from "@/actions/card.actions"
import { useLocale } from "@/components/LocaleProvider"

interface TargetDeck {
  id: string
  title: string
  color: string
}

interface Props {
  cardId: string
  fromDeckId: string
  decks: TargetDeck[]
}

export default function MoveCardButton({ cardId, fromDeckId, decks }: Props) {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  if (decks.length === 0) return null

  const handleMove = (toDeckId: string) => {
    setOpen(false)
    startTransition(() => moveCard(cardId, fromDeckId, toDeckId))
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="text-gray-300 hover:text-blue-400 disabled:opacity-50 text-sm transition-colors dark:text-zinc-600"
        aria-label={messages.card.move}
        title={messages.card.move}
      >
        {isPending ? "…" : "⇥"}
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-20 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-xs text-gray-400 px-3 py-1.5 border-b border-gray-50 dark:border-zinc-800 dark:text-zinc-500">{messages.card.moveToDeck}</p>
          {decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => handleMove(deck.id)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition-colors dark:text-zinc-300 dark:hover:bg-blue-950"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: deck.color }}
              />
              <span className="truncate">{deck.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
