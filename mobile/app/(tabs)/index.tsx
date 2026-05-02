import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import DeckCard from "@/components/deck/DeckCard"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Deck } from "@/lib/types"

export default function DecksScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const [decks, setDecks] = useState<(Deck & { _count: { cards: number } })[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const { decks } = await api.listDecks()
      setDecks(decks)
    } catch (err) {
      console.warn("[decks] load", err)
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

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>내 덱</Text>
        <Pressable
          onPress={() => router.push("/decks/new")}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.accent : colors.primary,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          })}
        >
          <Ionicons name="add" size={16} color={colors.primaryFg} />
          <Text style={{ color: colors.primaryFg, fontWeight: "600", fontSize: 13 }}>새 덱</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : decks.length === 0 ? (
        <EmptyState
          icon="albums-outline"
          title="아직 덱이 없어요."
          description="첫 번째 덱을 만들어보세요!"
        />
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => <DeckCard deck={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </View>
  )
}
