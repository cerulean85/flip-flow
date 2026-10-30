import { useEffect, useMemo, useRef, useState } from "react"
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BookmarkButton from "./BookmarkButton"
import { categoryColor } from "@/lib/category"
import { speak } from "@/lib/speech"
import { useTheme } from "@/lib/theme"
import { RADIUS, TYPE } from "@/lib/tokens.generated"

interface Props {
  cardId: string
  isBookmark: boolean
  category?: string | null
  front: string
  back: string
  // The side shown first is spoken in English, the other side in Korean
  frontLang: "en-US" | "ko-KR"
  onSwipe?: (dir: 1 | -1) => void
}

const SWIPE_DISTANCE = 60

// Long sentences shrink so they still fit the card without scrolling
function faceTextSize(text: string) {
  if (text.length <= 24) return { fontSize: TYPE.card.fontSize, lineHeight: TYPE.card.lineHeight }
  if (text.length <= 64) return { fontSize: 24, lineHeight: 32 }
  return { fontSize: 20, lineHeight: 28 }
}

export default function FlipCard({ cardId, isBookmark, category, front, back, frontLang, onSwipe }: Props) {
  const { colors } = useTheme()
  const [flipped, setFlipped] = useState(false)
  const value = useRef(new Animated.Value(0)).current
  const onSwipeRef = useRef(onSwipe)
  onSwipeRef.current = onSwipe

  useEffect(() => {
    Animated.spring(value, {
      toValue: flipped ? 180 : 0,
      useNativeDriver: true,
      damping: 14,
    }).start()
  }, [flipped, value])

  const pan = useMemo(
    () =>
      PanResponder.create({
        // Capture phase: a horizontal drag takes over from the card's tap-to-flip
        onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderRelease: (_, g) => {
          if (g.dx <= -SWIPE_DISTANCE) onSwipeRef.current?.(1)
          else if (g.dx >= SWIPE_DISTANCE) onSwipeRef.current?.(-1)
        },
      }),
    []
  )

  const frontRotate = value.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] })
  const backRotate = value.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] })
  const frontOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [1, 1, 0, 0] })
  const backOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [0, 0, 1, 1] })

  const backLang = frontLang === "en-US" ? "ko-KR" : "en-US"
  const visibleText = flipped ? back : front
  const visibleLang = flipped ? backLang : frontLang

  const face = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  }

  const hint = (label: string) => (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <Ionicons name="refresh" size={14} color={colors.textSubtle} />
      <Text style={{ ...TYPE.caption, color: colors.textSubtle }}>{label}</Text>
    </View>
  )

  return (
    <View style={{ flex: 1, minHeight: 240 }} {...pan.panHandlers}>
      <Pressable
        onPress={() => setFlipped((f) => !f)}
        accessibilityRole="button"
        accessibilityLabel={flipped ? `뒷면: ${back}. 탭하면 앞면으로 뒤집혀요` : `앞면: ${front}. 탭하면 뒤집혀요`}
        accessibilityHint="왼쪽이나 오른쪽으로 밀면 다음 카드나 이전 카드로 넘어가요"
        style={{ flex: 1 }}
      >
        <Animated.View style={[face, { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] }]}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ ...faceTextSize(front), color: colors.text, fontWeight: "700", textAlign: "center" }}>
              {front}
            </Text>
          </View>
          {hint("탭해서 뒤집기 · 좌우로 넘기기")}
        </Animated.View>

        <Animated.View
          style={[face, { opacity: backOpacity, transform: [{ rotateY: backRotate }] }]}
        >
          <View style={{ flex: 1, justifyContent: "center", gap: 12 }}>
            <Text style={{ ...TYPE.body, color: colors.textSubtle, textAlign: "center" }} numberOfLines={2}>
              {front}
            </Text>
            <Text style={{ ...faceTextSize(back), color: colors.text, fontWeight: "700", textAlign: "center" }}>
              {back}
            </Text>
          </View>
          {hint("탭해서 다시 뒤집기")}
        </Animated.View>
      </Pressable>

      {/* Header sits above both faces so its buttons stay tappable while flipping */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 8,
          left: 16,
          right: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {category ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: colors.cardAlt,
              borderRadius: 999,
              paddingVertical: 4,
              paddingLeft: 10,
              paddingRight: 12,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: categoryColor(category) }} />
            <Text style={{ ...TYPE.caption, color: colors.textMuted }}>{category}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => speak(visibleText, visibleLang)}
          accessibilityRole="button"
          accessibilityLabel="발음 듣기"
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="volume-medium-outline" size={22} color={colors.textMuted} />
        </Pressable>
        <View style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <BookmarkButton key={cardId} cardId={cardId} isBookmark={isBookmark} size={22} />
        </View>
      </View>
    </View>
  )
}
