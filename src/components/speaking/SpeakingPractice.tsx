"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Mic, Repeat2, Volume2 } from "lucide-react"
import type { Card } from "@/generated/prisma/client"
import { detectSpeechLang, speak, stopSpeaking } from "@/lib/speech"
import { useLocale } from "@/components/LocaleProvider"

type PracticeSide = "front" | "back"
type FeedbackState = "idle" | "correct" | "incorrect" | "error"

type SpeechAlternative = {
  transcript: string
  confidence: number
}

type SpeechRecognitionResultLike = {
  readonly length: number
  [index: number]: SpeechAlternative
}

type SpeechRecognitionEventLike = Event & {
  results: {
    readonly length: number
    [index: number]: SpeechRecognitionResultLike
  }
}

type SpeechRecognitionErrorEventLike = Event & {
  error: string
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface Props {
  cards: Card[]
}

function normalizeSpeech(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function levenshteinDistance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  const current = Array.from({ length: b.length + 1 }, () => 0)

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    previous.splice(0, previous.length, ...current)
  }

  return previous[b.length]
}

function isCloseMatch(target: string, transcript: string) {
  const normalizedTarget = normalizeSpeech(target)
  const normalizedTranscript = normalizeSpeech(transcript)
  if (!normalizedTarget || !normalizedTranscript) return false
  if (normalizedTarget === normalizedTranscript) return true
  if (normalizedTranscript.includes(normalizedTarget)) return true

  const maxLength = Math.max(normalizedTarget.length, normalizedTranscript.length)
  const distance = levenshteinDistance(normalizedTarget, normalizedTranscript)
  const similarity = 1 - distance / maxLength
  return similarity >= 0.72
}

function getInitialSide(card: Card): PracticeSide {
  const frontLang = detectSpeechLang(card.front)
  const backLang = detectSpeechLang(card.back)
  return frontLang === "en-US" || backLang === "ko-KR" ? "front" : "back"
}

export default function SpeakingPractice({ cards }: Props) {
  const { messages } = useLocale()
  const [index, setIndex] = useState(0)
  const card = cards[index]

  const goTo = (direction: number) => {
    if (cards.length === 0) return
    setIndex((current) => (current + direction + cards.length) % cards.length)
  }

  if (cards.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
        <Mic size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm">{messages.speaking.empty}</p>
      </div>
    )
  }

  return (
    <SpeakingPracticeCard
      key={card.id}
      card={card}
      current={index + 1}
      total={cards.length}
      onPrevious={() => goTo(-1)}
      onNext={() => goTo(1)}
    />
  )
}

function SpeakingPracticeCard({
  card,
  current,
  total,
  onPrevious,
  onNext,
}: {
  card: Card
  current: number
  total: number
  onPrevious: () => void
  onNext: () => void
}) {
  const { messages } = useLocale()
  const [side, setSide] = useState<PracticeSide>(() => getInitialSide(card))
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>("idle")
  const [guide, setGuide] = useState<string | null>(null)
  const [isGuideLoading, setIsGuideLoading] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const target = side === "front" ? card.front : card.back
  const lang = useMemo(() => detectSpeechLang(target), [target])
  const supportsRecognition = typeof window !== "undefined" && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      stopSpeaking()
    }
  }, [])

  const fetchGuide = async (nextAttempts: number, nextTranscript: string) => {
    if (nextAttempts < 3 || isGuideLoading || guide) return

    setIsGuideLoading(true)
    try {
      const res = await fetch("/api/pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, transcript: nextTranscript, lang }),
      })
      const data = await res.json()
      setGuide(data.explanation ?? data.error ?? messages.speaking.guideError)
    } catch {
      setGuide(messages.speaking.guideError)
    } finally {
      setIsGuideLoading(false)
    }
  }

  const handleTranscript = (nextTranscript: string) => {
    setTranscript(nextTranscript)

    if (isCloseMatch(target, nextTranscript)) {
      setFeedback("correct")
      setAttempts(0)
      setGuide(null)
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setFeedback("incorrect")
    void fetchGuide(nextAttempts, nextTranscript)
  }

  const startListening = () => {
    if (!supportsRecognition) {
      setFeedback("error")
      return
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) return

    recognitionRef.current?.abort()
    const recognition = new Recognition()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1]
      const spokenText = lastResult?.[0]?.transcript?.trim() ?? ""
      handleTranscript(spokenText)
    }
    recognition.onerror = (event) => {
      setIsListening(false)
      setFeedback("error")
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setTranscript(messages.speaking.permissionError)
      }
    }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    setIsListening(true)
    setFeedback("idle")
    recognition.start()
  }

  const toggleSide = () => {
    setSide((current) => (current === "front" ? "back" : "front"))
    setTranscript("")
    setAttempts(0)
    setFeedback("idle")
    setGuide(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500">
          {messages.speaking.progress(current, total)}
        </p>
        <button
          type="button"
          onClick={toggleSide}
          aria-label={messages.speaking.switchSide}
          title={messages.speaking.switchSide}
          className="inline-flex min-h-8 items-center gap-1 rounded-xl border border-blue-100 px-2.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
        >
          <Repeat2 size={14} aria-hidden="true" />
          {side === "front" ? messages.speaking.frontSide : messages.speaking.backSide}
        </button>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
          {messages.speaking.targetLabel}
        </p>
        <p className="whitespace-pre-wrap text-2xl font-semibold leading-relaxed text-gray-900 dark:text-zinc-100">
          {target}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => speak(target, lang)}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Volume2 size={17} aria-hidden="true" />
            {messages.speaking.listen}
          </button>
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isListening ? (
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
            ) : (
              <Mic size={17} aria-hidden="true" />
            )}
            {isListening
              ? messages.speaking.listening
              : transcript
                ? messages.speaking.retry
                : messages.speaking.start}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {messages.speaking.recognizedLabel}
        </p>
        <p className="min-h-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          {transcript || messages.speaking.noTranscript}
        </p>
        {feedback === "correct" && (
          <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {messages.speaking.correct}
          </p>
        )}
        {feedback === "incorrect" && (
          <p className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-400">
            {messages.speaking.incorrect(Math.min(attempts, 3))}
          </p>
        )}
        {feedback === "error" && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-500 dark:text-red-400">
            <AlertCircle size={15} aria-hidden="true" />
            {transcript || messages.speaking.unsupported}
          </p>
        )}
      </section>

      {(isGuideLoading || guide) && (
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-300">
            {messages.speaking.guideTitle}
          </p>
          {isGuideLoading ? (
            <p className="inline-flex items-center gap-2 text-sm text-blue-700 dark:text-blue-200">
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              {messages.speaking.guideLoading}
            </p>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-blue-950 dark:text-blue-100">
              {guide}
            </p>
          )}
        </section>
      )}

      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ChevronLeft size={17} aria-hidden="true" />
          {messages.speaking.previous}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {messages.speaking.next}
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
