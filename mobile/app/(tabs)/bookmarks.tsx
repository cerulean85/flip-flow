import { useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native"
import { useFocusEffect } from "expo-router"
import { getBookmarkedCards } from "../../lib/api"
import { COLORS } from "../../lib/constants"
import CardSlider from "../../components/CardSlider"
import EmptyState from "../../components/EmptyState"
import type { Card } from "../../lib/types"

export default function BookmarksTab() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCards = useCallback(async () => {
    try {
      const data = await getBookmarkedCards()
      setCards(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchCards()
    }, [fetchCards])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCards() }} tintColor={COLORS.primary} />
      }
    >
      <Text style={styles.title}>⭐ 북마크</Text>

      {cards.length > 0 ? (
        <CardSlider cards={cards} />
      ) : (
        <EmptyState
          emoji="☆"
          title="북마크한 카드가 없어요."
          subtitle="학습 중 별표를 눌러 저장해보세요!"
        />
      )}
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
})
