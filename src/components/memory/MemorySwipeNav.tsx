"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, useAnimationControls, type PanInfo } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  prevId: string | null
  nextId: string | null
  children: ReactNode
}

const SWIPE_THRESHOLD = 80
const EXIT_DURATION = 0.22
const ENTER_DURATION = 0.25

export default function MemorySwipeNav({ prevId, nextId, children }: Props) {
  const router = useRouter()
  const { messages } = useLocale()
  const t = messages.memory
  const controls = useAnimationControls()
  const isExitingRef = useRef(false)

  // Mount: slide in from a small offset + fade.
  useEffect(() => {
    isExitingRef.current = false
    controls.set({ x: 0, opacity: 0 })
    controls.start({ opacity: 1, transition: { duration: ENTER_DURATION, ease: "easeOut" } })
  }, [controls])

  async function exitTo(direction: "left" | "right", id: string) {
    if (isExitingRef.current) return
    isExitingRef.current = true
    const distance = typeof window !== "undefined" ? window.innerWidth : 400
    const x = direction === "left" ? -distance : distance
    await controls.start({
      x,
      opacity: 0,
      transition: { duration: EXIT_DURATION, ease: "easeIn" },
    })
    router.push(`/memory/${id}`)
  }

  function goPrev() {
    if (prevId) exitTo("right", prevId)
  }
  function goNext() {
    if (nextId) exitTo("left", nextId)
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD && nextId) {
      exitTo("left", nextId)
    } else if (info.offset.x > SWIPE_THRESHOLD && prevId) {
      exitTo("right", prevId)
    }
    // Otherwise framer's dragConstraints + dragElastic snap back to x: 0.
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }
      if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "ArrowRight") goNext()
      else if (e.key === "Escape") router.push("/memory")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevId, nextId])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link
          href="/memory"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>{t.back}</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={!prevId}
            aria-label={t.prev}
            title={t.prev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!nextId}
            aria-label={t.next}
            title={t.next}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}
