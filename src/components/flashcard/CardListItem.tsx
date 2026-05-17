"use client"

import { useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { useFormStatus } from "react-dom"
import { unstable_rethrow } from "next/navigation"
import { Star, X, Pencil, Trash2 } from "lucide-react"
import { updateCard, deleteCard } from "@/actions/card.actions"
import FlipCard from "./FlipCard"
import { SpeakingCardPractice } from "@/components/speaking/SpeakingPractice"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  cardId: string
  front: string
  back: string
  category: string | null
  isBookmark: boolean
}

function SaveButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

interface CardDetailModalProps {
  cardId: string
  front: string
  back: string
  isBookmark: boolean
  category: string | null
  onClose: () => void
}

function CardDetailModal({ cardId, front, back, isBookmark, category, onClose }: CardDetailModalProps) {
  const { messages } = useLocale()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, startDelete] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  async function handleSave(formData: FormData) {
    setError(null)
    try {
      await updateCard(cardId, formData)
      setIsEditing(false)
    } catch (err) {
      unstable_rethrow(err)
      console.error(err)
      setError(messages.card.updateError)
    }
  }

  function handleDelete() {
    setError(null)
    startDelete(async () => {
      try {
        await deleteCard(cardId)
        onClose()
      } catch (err) {
        unstable_rethrow(err)
        console.error(err)
        setError(messages.card.deleteError)
      }
    })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-md max-h-[90vh] flex flex-col bg-gray-50 rounded-t-2xl sm:rounded-2xl shadow-xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              {messages.card.detail}
            </p>
            {isBookmark && <Star size={14} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />}
          </div>
          <button
            onClick={onClose}
            aria-label={messages.card.close}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 pb-5 overflow-y-auto">
          {isEditing ? (
            <form action={handleSave} className="flex flex-col gap-2">
              <input
                name="category"
                defaultValue={category ?? ""}
                placeholder={messages.card.categoryPlaceholder}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <textarea
                name="front"
                defaultValue={front}
                required
                placeholder={messages.card.frontPlaceholder}
                autoFocus
                rows={2}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <textarea
                name="back"
                defaultValue={back}
                required
                placeholder={messages.card.backPlaceholder}
                rows={3}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <div className="flex gap-2 pt-1">
                <SaveButton label={messages.deck.save} pendingLabel={messages.deck.saving} />
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:border-zinc-700"
                >
                  {messages.essay.cancel}
                </button>
              </div>
            </form>
          ) : (
            <>
              <FlipCard
                front={front}
                back={back}
                categoryLabel={category ?? undefined}
                onFlipChange={setIsCardFlipped}
              />
              <div className="mt-4">
                <SpeakingCardPractice
                  key={`${cardId}-${isCardFlipped ? "back" : "front"}-speaking`}
                  target={isCardFlipped ? back : front}
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-200 pt-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors dark:text-zinc-300 dark:hover:text-blue-400 dark:border-zinc-700"
                >
                  <Pencil size={12} aria-hidden="true" />
                  {messages.card.edit}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 dark:text-zinc-300 dark:hover:text-red-400 dark:border-zinc-700"
                >
                  <Trash2 size={12} aria-hidden="true" />
                  {messages.card.delete}
                </button>
              </div>
            </>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function CardListItem({ cardId, front, back, category, isBookmark }: Props) {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full dark:bg-zinc-900 dark:border dark:border-zinc-800">
      <div className="relative h-full">
        <button
          type="button"
          className="block w-full h-full text-left px-3 py-3"
          onClick={() => setDetailOpen(true)}
        >
          {category && (
            <p className="text-[10px] uppercase tracking-wide text-blue-500 truncate dark:text-blue-400 mb-1">
              {category}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 dark:text-zinc-100">
            {front}
          </p>
          <p className="mt-1 text-xs text-gray-400 line-clamp-1 dark:text-zinc-500">
            {back}
          </p>
        </button>

        {isBookmark && (
          <Star
            size={12}
            className="absolute top-2 right-2 fill-yellow-400 text-yellow-400 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>

      {detailOpen && (
        <CardDetailModal
          cardId={cardId}
          front={front}
          back={back}
          isBookmark={isBookmark}
          category={category}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  )
}
