import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native"
import { useFocusEffect } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import CardForm from "@/components/flashcard/CardForm"
import CardListItem from "@/components/flashcard/CardListItem"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

export default function CardsScreen() {
  const { colors } = useTheme()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const { cards } = await api.listAllCards()
      setCards(cards)
    } catch (err) {
      console.warn("[cards] load", err)
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

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const c of cards) if (c.category) set.add(c.category)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [cards])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cards.filter((c) => {
      if (activeCategory && c.category !== activeCategory) return false
      if (q) {
        const f = c.front.toLowerCase().includes(q)
        const b = c.back.toLowerCase().includes(q)
        const cat = c.category?.toLowerCase().includes(q) ?? false
        if (!f && !b && !cat) return false
      }
      return true
    })
  }, [cards, query, activeCategory])

  const chip = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? colors.primary : colors.border,
    backgroundColor: active ? colors.primary : colors.card,
  })

  const header = (
    <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 12,
        }}
      >
        <Ionicons name="search" size={16} color={colors.textSubtle} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="검색 (앞면 / 뒷면 / 카테고리)"
          placeholderTextColor={colors.textSubtle}
          style={{
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 8,
            color: colors.text,
            fontSize: 14,
          }}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={colors.textSubtle} />
          </Pressable>
        )}
      </View>

      {categories.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pressable onPress={() => setActiveCategory(null)} style={chip(activeCategory === null)}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: activeCategory === null ? colors.primaryFg : colors.textMuted,
              }}
            >
              전체
            </Text>
          </Pressable>
          {categories.map((cat) => {
            const active = activeCategory === cat
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(active ? null : cat)}
                style={chip(active)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: active ? colors.primaryFg : colors.textMuted,
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}

      <CardForm onCreated={load} />
    </View>
  )

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
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
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>내 카드</Text>
        <Text style={{ color: colors.textSubtle, fontSize: 12 }}>{filtered.length} / {cards.length}</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        ListEmptyComponent={
          cards.length === 0 ? (
            <EmptyState
              icon="albums-outline"
              title="아직 카드가 없어요."
              description="위 폼에서 첫 카드를 추가해보세요!"
            />
          ) : (
            <EmptyState icon="search-outline" title="검색 결과가 없어요." />
          )
        }
        renderItem={({ item, index }) => (
          <CardListItem index={index} card={item} onChanged={load} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />
    </View>
  )
}
