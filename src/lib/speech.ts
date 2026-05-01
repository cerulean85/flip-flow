function detectLang(text: string): "ko-KR" | "en-US" {
  return /[ㄱ-ㆎ가-힣]/.test(text) ? "ko-KR" : "en-US"
}

export const speechVoiceStorageKeys = {
  ko: "flip-flow.speech.voice.ko-KR",
  en: "flip-flow.speech.voice.en-US",
} as const

const fixedVoiceNames = {
  ko: "yuna",
  en: "samantha",
} as const

let speakRequestId = 0

function getVoices() {
  if (typeof window === "undefined") return []
  if (!("speechSynthesis" in window)) return []
  return window.speechSynthesis.getVoices()
}

export function getSpeechVoices() {
  return getVoices()
}

function getStoredVoiceUri(lang: string) {
  if (typeof window === "undefined") return null

  try {
    if (lang.startsWith("ko")) return window.localStorage.getItem(speechVoiceStorageKeys.ko)
    if (lang.startsWith("en")) return window.localStorage.getItem(speechVoiceStorageKeys.en)
  } catch {
    return null
  }

  return null
}

function findFixedVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const normalizedLang = lang.toLowerCase()
  const languagePrefix = normalizedLang.split("-")[0]
  const fixedName = normalizedLang.startsWith("ko") ? fixedVoiceNames.ko : fixedVoiceNames.en

  return voices.find((voice) => {
    const voiceLang = voice.lang.toLowerCase()
    return voiceLang.startsWith(languagePrefix) && voice.name.toLowerCase().includes(fixedName)
  })
}

function selectVoice(lang: string) {
  const voices = getVoices()
  const fixedVoice = findFixedVoice(voices, lang)
  if (fixedVoice) return fixedVoice

  const storedVoiceUri = getStoredVoiceUri(lang)
  const storedVoice = voices.find((voice) => voice.voiceURI === storedVoiceUri)
  if (storedVoice) return storedVoice

  return voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase())
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase().split("-")[0]))
}

function speakNow(text: string, lang: string) {
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  utter.voice = selectVoice(lang) ?? null
  utter.rate = 0.85
  utter.pitch = 1
  window.speechSynthesis.speak(utter)
}

function speakWhenVoicesAreReady(text: string, lang: string, requestId: number) {
  const voices = getVoices()
  if (voices.length > 0) {
    if (requestId === speakRequestId) speakNow(text, lang)
    return
  }

  const speakAfterVoiceLoad = () => {
    window.speechSynthesis.removeEventListener("voiceschanged", speakAfterVoiceLoad)
    if (requestId === speakRequestId) speakNow(text, lang)
  }

  window.speechSynthesis.addEventListener("voiceschanged", speakAfterVoiceLoad)

  window.setTimeout(() => {
    window.speechSynthesis.removeEventListener("voiceschanged", speakAfterVoiceLoad)
    if (requestId === speakRequestId && getVoices().length > 0) speakNow(text, lang)
  }, 500)
}

export function speak(text: string, lang?: string) {
  if (typeof window === "undefined") return
  if (!("speechSynthesis" in window)) return
  const trimmed = text.trim()
  if (!trimmed) return

  window.speechSynthesis.cancel()

  const requestId = ++speakRequestId
  speakWhenVoicesAreReady(trimmed, lang ?? detectLang(trimmed), requestId)
}

export function stopSpeaking() {
  if (typeof window === "undefined") return
  if (!("speechSynthesis" in window)) return
  speakRequestId += 1
  window.speechSynthesis.cancel()
}
