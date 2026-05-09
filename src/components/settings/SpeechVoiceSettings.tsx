"use client"

import { useEffect, useMemo, useState } from "react"
import { Volume2 } from "lucide-react"
import { getSpeechVoices, speak, speechVoiceStorageKeys } from "@/lib/speech"
import { useLocale } from "@/components/LocaleProvider"

type VoiceOption = {
  lang: string
  localService: boolean
  name: string
  voiceURI: string
}

const languageSettings = [
  {
    labelKey: "korean",
    lang: "ko-KR",
    fixedVoice: "Yuna",
    storageKey: speechVoiceStorageKeys.ko,
    testText: "오늘도 좋은 흐름으로 공부해요.",
  },
  {
    labelKey: "english",
    lang: "en-US",
    fixedVoice: "Samantha",
    storageKey: speechVoiceStorageKeys.en,
    testText: "Small steps make strong memory.",
  },
] as const

function toVoiceOption(voice: SpeechSynthesisVoice): VoiceOption {
  return {
    lang: voice.lang,
    localService: voice.localService,
    name: voice.name,
    voiceURI: voice.voiceURI,
  }
}

export default function SpeechVoiceSettings() {
  const { messages } = useLocale()
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {}

    return Object.fromEntries(
      languageSettings.map(({ lang, storageKey }) => {
        try {
          return [lang, window.localStorage.getItem(storageKey) ?? ""]
        } catch {
          return [lang, ""]
        }
      })
    )
  })

  useEffect(() => {
    const syncVoices = () => setVoices(getSpeechVoices().map(toVoiceOption))

    syncVoices()
    window.speechSynthesis?.addEventListener("voiceschanged", syncVoices)

    return () => window.speechSynthesis?.removeEventListener("voiceschanged", syncVoices)
  }, [])

  const voicesByLanguage = useMemo(() => {
    return Object.fromEntries(
      languageSettings.map(({ lang }) => [
        lang,
        voices.filter((voice) => voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())),
      ])
    )
  }, [voices])

  const updateVoice = (lang: string, storageKey: string, voiceURI: string) => {
    setSelected((current) => ({ ...current, [lang]: voiceURI }))

    try {
      if (voiceURI) window.localStorage.setItem(storageKey, voiceURI)
      else window.localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage failures; speech can still use the browser default.
    }
  }

  return (
    <div className="space-y-4">
      {languageSettings.map(({ labelKey, lang, fixedVoice, storageKey, testText }) => {
        const languageVoices = voicesByLanguage[lang] ?? []
        const label = messages.settings.voice[labelKey]

        return (
          <div key={lang} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor={`voice-${lang}`} className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                {label}
              </label>
              <button
                type="button"
                onClick={() => speak(testText, lang)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                aria-label={`${label} ${messages.settings.voice.testSuffix}`}
                title={`${label} ${messages.settings.voice.testSuffix}`}
              >
                <Volume2 size={15} aria-hidden="true" />
              </button>
            </div>
            <select
              id={`voice-${lang}`}
              value={selected[lang] ?? ""}
              onChange={(event) => updateVoice(lang, storageKey, event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
            >
              <option value="">{messages.settings.voice.defaultOption(fixedVoice)}</option>
              {languageVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang}
                  {voice.localService ? `, ${messages.settings.voice.localDevice}` : ""})
                </option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}
