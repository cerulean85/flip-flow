import { useCallback, useEffect, useState } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect } from "expo-router"
import CardSlider from "@/components/flashcard/CardSlider"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import { RADIUS } from "@/lib/tokens.generated"
import type { Card } from "@/lib/types"

function StudySkeleton() {
  const { colors } = useTheme()
  const block = (style: object) => <View style={[{ backgroundColor: colors.border, borderRadius: RADIUS.sm }, style]} />
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }} accessibilityLabel="카드를 불러오는 중">
      {block({ height: 6, borderRadius: 3, marginTop: 20 })}
      {block({ height: 36, width: 150, borderRadius: 999 })}
      <View
        style={{
          flex: 1,
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {block({ height: 28, width: "70%" })}
        {block({ height: 28, width: "45%" })}
      </View>
      {block({ height: 52, borderRadius: RADIUS.lg })}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {block({ flex: 1, height: 48, borderRadius: RADIUS.md })}
        {block({ flex: 1, height: 48, borderRadius: RADIUS.md })}
      </View>
    </View>
  )
}

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
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      {loading ? (
        <StudySkeleton />
      ) : cards.length === 0 ? (
        <EmptyState icon="albums-outline" title="아직 카드가 없어요." description="어휘노트에서 첫 카드를 추가해 보세요." />
      ) : (
        <CardSlider cards={cards} />
      )}
    </SafeAreaView>
  )
}
