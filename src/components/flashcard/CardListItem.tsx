"use client"

import { useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { useFormStatus } from "react-dom"
import { Star, X, Pencil, ArrowRight, Trash2 } from "lucide-react"
import { updateCard, deleteCard, moveCard } from "@/actions/card.actions"
import FlipCard from "./FlipCard"

interface TargetDeck {
  id: string
  title: string
  color: string
}

interface Props {
  index: number
  cardId: string
  deckId: string
  front: string
  back: string
  isBookmark: boolean
  otherDecks: TargetDeck[]
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "저장 중..." : "저장"}
    </button>
  )
}

function IconButton({
  onClick,
  disabled,
  label,
  danger,
  children,
}: {
  onClick?: () => void
  disabled?: boolean
  label: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40
        ${danger
          ? "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-zinc-500 dark:hover:bg-red-950"
          : "text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-500 dark:hover:text-blue-400 dark:hover:bg-blue-950"
        }`}
    >
      {children}
    </button>
  )
}

interface MoveDeckModalProps {
  decks: TargetDeck[]
  onSelect: (deckId: string) => void
  onClose: () => void
}

function MoveDeckModal({ decks, onSelect, onClose }: MoveDeckModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-xl pb-safe dark:bg-zinc-900 dark:border dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-zinc-800">
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">이동할 덱 선택</p>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <ul className="py-2 max-h-72 overflow-y-auto">
          {decks.map((deck) => (
            <li key={deck.id}>
              <button
                onClick={() => onSelect(deck.id)}
                className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors dark:text-zinc-300 dark:hover:bg-blue-950"
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: deck.color }} />
                <span className="truncate">{deck.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  )
}

interface CardDetailModalProps {
  front: string
  back: string
  isBookmark: boolean
  onClose: () => void
}

function CardDetailModal({ front, back, isBookmark, onClose }: CardDetailModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-md bg-gray-50 rounded-t-2xl sm:rounded-2xl shadow-xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">카드 상세</p>
            {isBookmark && <Star size={14} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />}
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 pb-8">
          <FlipCard front={front} back={back} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function CardListItem({
  index, cardId, deckId, front, back, isBookmark, otherDecks,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isDeleting, startDelete] = useTransition()
  const [isMoving, startMove] = useTransition()

  async function handleSave(formData: FormData) {
    await updateCard(cardId, deckId, formData)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border dark:border-zinc-800">
      {isEditing ? (
        <form action={handleSave} className="p-4 flex flex-col gap-2">
          <textarea
            name="front"
            defaultValue={front}
            required
            placeholder="앞면 (질문)"
            autoFocus
            rows={2}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <textarea
            name="back"
            defaultValue={back}
            required
            placeholder="뒷면 (답)"
            rows={3}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <div className="flex gap-2 pt-1">
            <SaveButton />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 dark:border-zinc-700"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-xs text-gray-300 font-mono min-w-[1.25rem] shrink-0 dark:text-zinc-600">
            {index + 1}
          </span>

          {/* 클릭 시 상세 모달 */}
          <button
            className="flex-1 min-w-0 text-left"
            onClick={() => setDetailOpen(true)}
          >
            <p className="text-sm font-medium text-gray-800 truncate dark:text-zinc-100">{front}</p>
            <p className="text-sm text-gray-400 truncate dark:text-zinc-500">{back}</p>
          </button>

          <div className="flex items-center gap-0.5 shrink-0">
            {isBookmark && (
              <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            )}

            {/* 수정 */}
            <IconButton onClick={() => setIsEditing(true)} label="카드 수정">
              <Pencil size={14} aria-hidden="true" />
            </IconButton>

            {/* 덱 이동 */}
            {otherDecks.length > 0 && (
              <>
                <IconButton
                  onClick={() => setMoveOpen(true)}
                  disabled={isMoving}
                  label="다른 덱으로 이동"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                </IconButton>

                {moveOpen && (
                  <MoveDeckModal
                    decks={otherDecks}
                    onSelect={(targetDeckId) => {
                      setMoveOpen(false)
                      startMove(() => moveCard(cardId, deckId, targetDeckId))
                    }}
                    onClose={() => setMoveOpen(false)}
                  />
                )}
              </>
            )}

            {/* 삭제 */}
            <IconButton
              onClick={() => startDelete(() => deleteCard(cardId, deckId))}
              disabled={isDeleting}
              label="카드 삭제"
              danger
            >
              <Trash2 size={14} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      )}

      {detailOpen && (
        <CardDetailModal
          front={front}
          back={back}
          isBookmark={isBookmark}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  )
}
