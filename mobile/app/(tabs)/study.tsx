import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { useFocusEffect } from "expo-router"
import CardSlider from "@/components/flashcard/CardSlider"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

export default function StudyAllScreen() {
  const { colors } = useTheme()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const { cards } = await api.listAllCards()
      setCards(cards)
    } catch (err) {
      console.warn("[study] load", err)
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
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>전체 학습</Text>
        <Text style={{ color: colors.textSubtle, fontSize: 12, marginTop: 2 }}>
          모든 덱의 카드 {cards.length}장
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : cards.length === 0 ? (
        <EmptyState
          icon="albums-outline"
          title="아직 카드가 없어요."
          description="덱에서 카드를 추가해보세요!"
        />
      ) : (
        <CardSlider cards={cards} />
      )}
    </ScrollView>
  )
}
