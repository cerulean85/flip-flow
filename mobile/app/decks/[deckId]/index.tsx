import { useState, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native"
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import * as api from "../../../lib/api"
import { COLORS } from "../../../lib/constants"
import CardListItem from "../../../components/CardListItem"
import CardForm from "../../../components/CardForm"
import EmptyState from "../../../components/EmptyState"
import type { Deck, Card } from "../../../lib/types"

export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const router = useRouter()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [otherDecks, setOtherDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [deckData, cardsData, allDecks] = await Promise.all([
        api.getDeck(deckId),
        api.getDeckCards(deckId),
        api.getDecks(),
      ])
      setDeck(deckData)
      setCards(cardsData)
      setOtherDecks(allDecks.filter((d) => d.id !== deckId))
    } catch {
      Alert.alert("오류", "덱을 불러올 수 없습니다.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [deckId])

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  const handleAddCard = async (data: { front: string; back: string }) => {
    await api.createCard(deckId, data)
    fetchData()
  }

  const handleDeleteDeck = () => {
    Alert.alert("덱 삭제", "이 덱과 모든 카드를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await api.deleteDeck(deckId)
          router.replace("/(tabs)")
        },
      },
    ])
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
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData() }} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← 뒤로</Text>
            </Pressable>

            <View style={styles.titleRow}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>{deck?.title}</Text>
                {deck?.description ? (
                  <Text style={styles.description}>{deck.description}</Text>
                ) : null}
              </View>
              <Pressable onPress={handleDeleteDeck}>
                <Text style={styles.deleteIcon}>🗑</Text>
              </Pressable>
            </View>

            {cards.length > 0 && (
              <Pressable
                onPress={() => router.push(`/decks/${deckId}/study`)}
                style={styles.studyButton}
              >
                <Text style={styles.studyButtonText}>학습 시작</Text>
              </Pressable>
            )}

            <Text style={styles.sectionTitle}>
              카드 ({cards.length})
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <CardListItem
            card={item}
            index={index}
            otherDecks={otherDecks}
            onUpdated={fetchData}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            emoji="📭"
            title="아직 카드가 없어요."
            subtitle="아래에서 추가해보세요!"
          />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <CardForm onSubmit={handleAddCard} />
          </View>
        }
      />
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  deleteIcon: {
    fontSize: 18,
    padding: 4,
  },
  studyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  studyButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 24,
    marginBottom: 4,
  },
  separator: {
    height: 8,
  },
  footer: {
    marginTop: 20,
  },
})
