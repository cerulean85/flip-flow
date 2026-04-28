import { useState, useCallback } from "react"
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import * as api from "../../../lib/api"
import { COLORS } from "../../../lib/constants"
import CardSlider from "../../../components/CardSlider"
import type { Deck, Card } from "../../../lib/types"

export default function StudyScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const router = useRouter()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        try {
          const [deckData, cardsData] = await Promise.all([
            api.getDeck(deckId),
            api.getDeckCards(deckId),
          ])
          setDeck(deckData)
          setCards(cardsData)
        } catch {
          // ignore
        } finally {
          setLoading(false)
        }
      })()
    }, [deckId])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>카드가 없습니다.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← 돌아가기</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>

      <Text style={styles.title}>{deck?.title}</Text>
      <Text style={styles.subtitle}>학습 모드</Text>

      <CardSlider cards={cards} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 20,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  backLink: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
  },
})
