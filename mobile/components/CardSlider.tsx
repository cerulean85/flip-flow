import { useState, useCallback } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import FlipCard from "./FlipCard"
import BookmarkButton from "./BookmarkButton"
import { COLORS } from "../lib/constants"
import type { Card } from "../lib/types"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CardSliderProps {
  cards: Card[]
}

export default function CardSlider({ cards }: CardSliderProps) {
  const [shuffled, setShuffled] = useState(() => shuffle(cards))
  const [reversed, setReversed] = useState<boolean[]>(() =>
    cards.map(() => Math.random() < 0.5)
  )
  const [index, setIndex] = useState(0)

  const paginate = useCallback(
    (dir: number) => {
      const next = index + dir
      if (next < 0 || next >= shuffled.length) return
      setIndex(next)
    },
    [index, shuffled.length]
  )

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    setReversed(cards.map(() => Math.random() < 0.5))
    setIndex(0)
  }

  const card = shuffled[index]
  if (!card) return null

  const front = reversed[index] ? card.back : card.front
  const back = reversed[index] ? card.front : card.back
  const progress = ((index + 1) / shuffled.length) * 100

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.counter}>
          {index + 1} / {shuffled.length}
        </Text>
        <Pressable onPress={reshuffle}>
          <Text style={styles.shuffleButton}>🔀 다시 섞기</Text>
        </Pressable>
      </View>

      {/* Card */}
      <FlipCard key={card.id} front={front} back={back} />

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          onPress={() => paginate(-1)}
          disabled={index === 0}
          style={styles.navButton}
        >
          <Text style={[styles.navText, index === 0 && styles.navDisabled]}>
            ← 이전
          </Text>
        </Pressable>

        <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />

        <Pressable
          onPress={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navText,
              index === shuffled.length - 1 && styles.navDisabled,
            ]}
          >
            다음 →
          </Text>
        </Pressable>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  shuffleButton: {
    fontSize: 12,
    color: "#818CF8",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  navDisabled: {
    color: COLORS.textMuted,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
})
