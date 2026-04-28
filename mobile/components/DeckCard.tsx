import { View, Text, StyleSheet, Pressable } from "react-native"
import { COLORS } from "../lib/constants"
import type { Deck } from "../lib/types"

interface DeckCardProps {
  deck: Deck
  onPress: () => void
}

export default function DeckCard({ deck, onPress }: DeckCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.colorStripe, { backgroundColor: deck.color }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {deck.title}
        </Text>
        {deck.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {deck.description}
          </Text>
        ) : null}
        <Text style={styles.count}>
          {deck._count?.cards ?? 0}장의 카드
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  colorStripe: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  count: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
})
