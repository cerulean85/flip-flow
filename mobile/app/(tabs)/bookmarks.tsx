import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { useFocusEffect } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import CardSlider from "@/components/flashcard/CardSlider"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

export default function BookmarksScreen() {
  const { colors } = useTheme()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const { cards } = await api.listBookmarks()
      setCards(cards)
    } catch (err) {
      console.warn("[bookmarks] load", err)
    }
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <Ionicons name="star" size={20} color={colors.star} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>북마크</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : cards.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="북마크한 카드가 없어요."
          description="학습 중 별표를 눌러 저장해보세요!"
        />
      ) : (
        <CardSlider cards={cards} />
      )}
    </ScrollView>
  )
}
