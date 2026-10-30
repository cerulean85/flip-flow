import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { useFocusEffect } from "expo-router"
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
    // CardSlider fills the screen height, so no ScrollView; the tab header already says 북마크
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : cards.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="북마크한 카드가 없어요."
          description="학습 중 별표를 눌러 저장해보세요!"
        />
      ) : (
        <CardSlider cards={cards} />
      )}
    </View>
  )
}
