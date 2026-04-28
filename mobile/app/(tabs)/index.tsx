import { useState, useCallback } from "react"
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { getDecks } from "../../lib/api"
import { useAuth } from "../../lib/auth"
import { COLORS } from "../../lib/constants"
import DeckCard from "../../components/DeckCard"
import EmptyState from "../../components/EmptyState"
import type { Deck } from "../../lib/types"

export default function DecksTab() {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDecks = useCallback(async () => {
    try {
      const data = await getDecks()
      setDecks(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchDecks()
    }, [fetchDecks])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchDecks()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}` : ""} 👋</Text>
              <Text style={styles.deckCount}>{decks.length}개의 덱</Text>
            </View>
            <Pressable onPress={signOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>로그아웃</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <DeckCard
            deck={item}
            onPress={() => router.push(`/decks/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            emoji="📭"
            title="아직 덱이 없어요."
            subtitle="새 덱을 만들어 카드를 추가해보세요!"
          />
        }
      />

      {/* Floating create button */}
      <Pressable
        onPress={() => router.push("/decks/new")}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  deckCount: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  signOutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
  },
  signOutText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  separator: {
    height: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: "300",
    marginTop: -2,
  },
})
