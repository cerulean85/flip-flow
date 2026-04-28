import { useState } from "react"
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated"
import { COLORS } from "../lib/constants"
import { searchDefinition } from "../lib/api"
import AiResultPanel from "./AiResultPanel"

interface FlipCardProps {
  front: string
  back: string
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const rotation = useSharedValue(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleFlip = () => {
    const next = !isFlipped
    setIsFlipped(next)
    rotation.value = withSpring(next ? 180 : 0, {
      stiffness: 300,
      damping: 30,
    })
  }

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180])
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    }
  })

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360])
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    }
  })

  const handleSearch = async () => {
    if (isSearching) return
    if (showResult && aiResult) {
      setShowResult(false)
      return
    }

    setIsSearching(true)
    setShowResult(false)
    setAiResult(null)

    try {
      const data = await searchDefinition(front)
      setAiResult(data.result)
    } catch {
      setAiResult("네트워크 오류가 발생했습니다.")
    } finally {
      setIsSearching(false)
      setShowResult(true)
    }
  }

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={handleFlip}>
        <View style={styles.cardContainer}>
          {/* Front */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <Text style={styles.frontText}>{front}</Text>
            <Text style={styles.hint}>탭하여 뒤집기</Text>
            <Pressable onPress={handleSearch} style={styles.searchButton}>
              {isSearching ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.searchIcon}>🔍</Text>
              )}
              <Text style={styles.searchLabel}>뜻 검색</Text>
            </Pressable>
          </Animated.View>

          {/* Back */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Text style={styles.backText}>{back}</Text>
            <Text style={styles.hint}>탭하여 뒤집기</Text>
            <Pressable onPress={handleSearch} style={styles.searchButton}>
              {isSearching ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.searchIcon}>🔍</Text>
              )}
              <Text style={styles.searchLabel}>뜻 검색</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Pressable>

      {showResult && aiResult && (
        <AiResultPanel result={aiResult} onClose={() => setShowResult(false)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  cardContainer: {
    minHeight: 160,
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: 160,
    borderRadius: 16,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardFront: {
    backgroundColor: COLORS.white,
  },
  cardBack: {
    backgroundColor: COLORS.primaryLight,
  },
  frontText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
  backText: {
    fontSize: 18,
    color: "#374151",
    textAlign: "center",
    lineHeight: 26,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  searchButton: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 12,
  },
  searchLabel: {
    fontSize: 11,
    color: "#818CF8",
  },
})
