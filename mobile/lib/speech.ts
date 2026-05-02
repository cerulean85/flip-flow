import * as Speech from "expo-speech"

export function speak(text: string, lang: "ko-KR" | "en-US" = "ko-KR") {
  Speech.stop()
  Speech.speak(text, { language: lang, rate: 1, pitch: 1 })
}

export function stopSpeaking() {
  Speech.stop()
}
