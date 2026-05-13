import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Animated, Easing, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { api } from "@/lib/api"
import { speak } from "@/lib/speech"
import { useTheme } from "@/lib/theme"
import type { Sentence } from "@/lib/types"
import SentenceFlip from "./SentenceFlip"

interface Props {
  deckId: string
  front: string
  back: string
  onEdit?: () => void
}

export default function FlipCard({ deckId, front, back, onEdit }: Props) {
  const { colors } = useTheme()
  const [flipped, setFlipped] = useState(false)
  const value = useRef(new Animated.Value(0)).current

  const [definition, setDefinition] = useState<string | null>(null)
  const [definitionTerm, setDefinitionTerm] = useState<string | null>(null)
  const [defLoading, setDefLoading] = useState(false)
  const [showDef, setShowDef] = useState(false)

  const [sentences, setSentences] = useState<Sentence[] | null>(null)
  const [sentLoading, setSentLoading] = useState(false)
  const [sentError, setSentError] = useState<string | null>(null)
  const [showSent, setShowSent] = useState(false)

  useEffect(() => {
    Animated.spring(value, {
      toValue: flipped ? 180 : 0,
      useNativeDriver: true,
      damping: 14,
    }).start()
  }, [flipped, value])

  const frontInterpolate = value.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] })
  const backInterpolate = value.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] })
  const frontOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [1, 1, 0, 0] })
  const backOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [0, 0, 1, 1] })

  const handleSearch = async () => {
    if (defLoading) return

    const visibleTerm = flipped ? back : front

    if (showDef && definition && definitionTerm === visibleTerm) {
      setShowDef(false)
      return
    }
    setDefLoading(true)
    setDefinitionTerm(visibleTerm)
    try {
      const { result } = await api.searchDefinition(visibleTerm)
      setDefinition(result)
      setShowDef(true)
    } catch (e) {
      setDefinition(e instanceof Error ? e.message : "결과를 가져올 수 없습니다.")
      setShowDef(true)
    } finally {
      setDefLoading(false)
    }
  }

  const handleSentences = async () => {
    if (sentLoading) return
    if (showSent && (sentences || sentError)) {
      setShowSent(false)
      return
    }
    setSentLoading(true)
    setSentError(null)
    try {
      const { sentences: list } = await api.generateSentences(front, back)
      if (list && list.length > 0) {
        setSentences(list)
        setShowSent(true)
      } else {
        setSentError("예문을 생성하지 못했습니다.")
        setShowSent(true)
      }
    } catch (e) {
      setSentError(e instanceof Error ? e.message : "네트워크 오류")
      setShowSent(true)
    } finally {
      setSentLoading(false)
    }
  }

  const cardBase = {
    borderRadius: 20,
    padding: 24,
    paddingTop: 58,
    minHeight: 200,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  }

  return (
    <View style={{ gap: 12 }}>
      <Pressable onPress={() => setFlipped((f) => !f)} style={{ position: "relative", minHeight: 200 }}>
        <Animated.View
          style={[
            cardBase,
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: frontOpacity,
              transform: [{ rotateY: frontInterpolate }],
            },
          ]}
        >
          {onEdit && (
            <Pressable
              onPress={(event) => {
                event.stopPropagation()
                onEdit()
              }}
              hitSlop={8}
              style={{ position: "absolute", top: 12, right: 12, padding: 6, zIndex: 1 }}
              accessibilityLabel="카드 수정"
            >
              <Ionicons name="pencil" size={18} color={colors.textSubtle} />
            </Pressable>
          )}
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "600", textAlign: "center" }}>
            {front}
          </Text>
          <Pressable
            onPress={() => speak(front, "en-US")}
            hitSlop={8}
            style={{ position: "absolute", top: 12, left: 12, padding: 6 }}
            accessibilityLabel="읽기"
          >
            <Ionicons name="volume-medium-outline" size={18} color={colors.textSubtle} />
          </Pressable>
          <Text style={{ marginTop: 12, color: colors.textSubtle, fontSize: 12 }}>탭하여 뒤집기</Text>
        </Animated.View>

        <Animated.View
          style={[
            cardBase,
            {
              backgroundColor: colors.primarySoft,
              borderWidth: 1,
              borderColor: colors.border,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: backOpacity,
              transform: [{ rotateY: backInterpolate }],
            },
          ]}
        >
          {onEdit && (
            <Pressable
              onPress={(event) => {
                event.stopPropagation()
                onEdit()
              }}
              hitSlop={8}
              style={{ position: "absolute", top: 12, right: 12, padding: 6, zIndex: 1 }}
              accessibilityLabel="카드 수정"
            >
              <Ionicons name="pencil" size={18} color={colors.textSubtle} />
            </Pressable>
          )}
          <Text style={{ color: colors.text, fontSize: 18, textAlign: "center" }}>{back}</Text>
          <Pressable
            onPress={() => speak(back, "ko-KR")}
            hitSlop={8}
            style={{ position: "absolute", top: 12, left: 12, padding: 6 }}
            accessibilityLabel="읽기"
          >
            <Ionicons name="volume-medium-outline" size={18} color={colors.textSubtle} />
          </Pressable>
          <Text style={{ marginTop: 12, color: colors.textSubtle, fontSize: 12 }}>탭하여 뒤집기</Text>
        </Animated.View>
      </Pressable>

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>
        <Pressable
          onPress={handleSentences}
          disabled={sentLoading}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          {sentLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="chatbubbles-outline" size={14} color={colors.primary} />
          )}
          <Text style={{ color: colors.primary, fontSize: 12 }}>예문</Text>
        </Pressable>
        <Pressable
          onPress={handleSearch}
          disabled={defLoading}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          {defLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="search" size={14} color={colors.primary} />
          )}
          <Text style={{ color: colors.primary, fontSize: 12 }}>뜻 검색</Text>
        </Pressable>
      </View>

      {showDef && definition && (
        <View
          style={{
            borderRadius: 16,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              ✨ AI 검색 결과
            </Text>
            <Pressable onPress={() => setShowDef(false)} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.textSubtle} />
            </Pressable>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>{definition}</Text>
        </View>
      )}

      {showSent && (sentences || sentError) && (
        <View
          style={{
            borderRadius: 16,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              스피킹 예문
            </Text>
            <Pressable onPress={() => setShowSent(false)} hitSlop={8}>
              <Ionicons name="close" size={16} color={colors.textSubtle} />
            </Pressable>
          </View>
          {sentError ? (
            <Text style={{ color: colors.danger, fontSize: 13 }}>{sentError}</Text>
          ) : (
            <>
              <Text style={{ marginBottom: 4, fontSize: 11, color: colors.textSubtle }}>
                문장을 탭하면 영어 번역을 볼 수 있어요
              </Text>
              {sentences!.map((s, i) => (
                <SentenceFlip key={i} deckId={deckId} ko={s.ko} en={s.en} index={i} />
              ))}
            </>
          )}
        </View>
      )}
    </View>
  )
}
