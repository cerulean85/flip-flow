"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  Loader2,
  MessageCircleQuestion,
  Mic,
  Volume2,
} from "lucide-react"
import { detectSpeechLang, speak, stopSpeaking } from "@/lib/speech"
import { useLocale } from "@/components/LocaleProvider"

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

function getSimilarityScore(target: string, transcript: string) {
  const normalizedTarget = normalizeSpeech(target)
  const normalizedTranscript = normalizeSpeech(transcript)
  if (!normalizedTarget || !normalizedTranscript) return 0
  if (normalizedTarget === normalizedTranscript) return 100
  if (normalizedTranscript.includes(normalizedTarget)) return 100

  const maxLength = Math.max(normalizedTarget.length, normalizedTranscript.length)
  const distance = levenshteinDistance(normalizedTarget, normalizedTranscript)
  const similarity = 1 - distance / maxLength
  return Math.max(0, Math.min(100, Math.round(similarity * 100)))
}

function isCloseMatch(score: number) {
  return score >= 72
}

interface SpeakingCardPracticeProps {
  target: string
}

export function SpeakingCardPractice({ target }: SpeakingCardPracticeProps) {
  const { messages } = useLocale()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [similarityScore, setSimilarityScore] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>("idle")
  const [guide, setGuide] = useState<string | null>(null)
  const [isGuideLoading, setIsGuideLoading] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const lang = useMemo(() => detectSpeechLang(target), [target])
  const supportsRecognition = typeof window !== "undefined" && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      stopSpeaking()
    }
  }, [])

  const fetchGuide = async (nextTranscript: string) => {
    if (isGuideLoading) return

    setIsGuideLoading(true)
    setGuide(null)
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
    const nextScore = getSimilarityScore(target, nextTranscript)
    setTranscript(nextTranscript)
    setSimilarityScore(nextScore)

    if (isCloseMatch(nextScore)) {
      setFeedback("correct")
      setAttempts(0)
      setGuide(null)
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setFeedback("incorrect")
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

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
          {messages.speaking.title}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
          onClick={() => void fetchGuide(transcript)}
          disabled={isGuideLoading}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-blue-100 px-4 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950"
        >
          {isGuideLoading ? (
            <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          ) : (
            <MessageCircleQuestion size={17} aria-hidden="true" />
          )}
          {messages.speaking.explain}
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

      <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-zinc-950">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {messages.speaking.recognizedLabel}
        </p>
        <p className="min-h-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          {transcript || messages.speaking.noTranscript}
        </p>
        {similarityScore !== null && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400 dark:text-zinc-500">
              <span>{messages.speaking.similarity}</span>
              <span>{messages.speaking.similarityScore(similarityScore)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${similarityScore}%` }}
              />
            </div>
          </div>
        )}
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
      </div>

      {(isGuideLoading || guide) && (
        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/40">
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
        </div>
      )}
    </section>
  )
}
