"use client"

import { useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { useFormStatus } from "react-dom"
import { updateCard, deleteCard, moveCard } from "@/actions/card.actions"

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
      className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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
          ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
          : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
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
        className="relative w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">이동할 덱 선택</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <ul className="py-2 max-h-72 overflow-y-auto">
          {decks.map((deck) => (
            <li key={deck.id}>
              <button
                onClick={() => onSelect(deck.id)}
                className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-3 transition-colors"
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

export default function CardListItem({
  index, cardId, deckId, front, back, isBookmark, otherDecks,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [isDeleting, startDelete] = useTransition()
  const [isMoving, startMove] = useTransition()

  async function handleSave(formData: FormData) {
    await updateCard(cardId, deckId, formData)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {isEditing ? (
        <form action={handleSave} className="p-4 flex flex-col gap-2">
          <input
            name="front"
            defaultValue={front}
            required
            placeholder="앞면 (질문)"
            autoFocus
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="back"
            defaultValue={back}
            required
            placeholder="뒷면 (답)"
            className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2 pt-1">
            <SaveButton />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-xs text-gray-300 font-mono min-w-[1.25rem] shrink-0">
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{front}</p>
            <p className="text-sm text-gray-400 truncate">{back}</p>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {isBookmark && <span className="text-yellow-400 text-xs mr-1">⭐</span>}

            {/* 수정 */}
            <IconButton onClick={() => setIsEditing(true)} label="카드 수정">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </IconButton>

            {/* 덱 이동 */}
            {otherDecks.length > 0 && (
              <>
                <IconButton
                  onClick={() => setMoveOpen(true)}
                  disabled={isMoving}
                  label="다른 덱으로 이동"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}
