import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"
import CardSlider from "@/components/flashcard/CardSlider"
import EmptyState from "@/components/ui/EmptyState"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card, Deck } from "@/lib/types"

export default function DeckStudyScreen() {
  const { colors } = useTheme()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [deck, setDeck] = useState<(Deck & { cards: Card[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!deckId) return
    api
      .getDeck(deckId)
      .then(({ deck }) => setDeck(deck))
      .catch((e) => console.warn("[deck/study]", e))
      .finally(() => setLoading(false))
  }, [deckId])

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={deck?.title ?? "학습"}
        fallback={deckId ? `/decks/${deckId}` : "/(tabs)"}
      />
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !deck || deck.cards.length === 0 ? (
        <EmptyState icon="file-tray-outline" title="학습할 카드가 없어요." />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={{ color: colors.textSubtle, fontSize: 12, marginBottom: 12 }}>학습 모드</Text>
          <CardSlider cards={deck.cards} />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
