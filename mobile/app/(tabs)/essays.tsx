import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import EmptyState from "@/components/ui/EmptyState"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Essay } from "@/lib/types"

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ko", { year: "numeric", month: "long", day: "numeric" })
}

function previewText(markdown: string, len = 120) {
  const trimmed = markdown.replace(/[#*`>\-_~[\]()]/g, " ").replace(/\s+/g, " ").trim()
  return trimmed.length <= len ? trimmed : trimmed.slice(0, len) + "…"
}

export default function EssaysScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const [essays, setEssays] = useState<Essay[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const { essays } = await api.listEssays()
      setEssays(essays)
    } catch (err) {
      console.warn("[essays] load", err)
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
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>에세이</Text>
        <Pressable
          onPress={() => router.push("/essays/new")}
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
          <Text style={{ color: colors.primaryFg, fontWeight: "600", fontSize: 13 }}>새 에세이</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : essays.length === 0 ? (
        <EmptyState
          icon="create-outline"
          title="아직 작성한 에세이가 없어요."
          description="첫 글을 남겨보세요!"
        />
      ) : (
        <FlatList
          data={essays}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/essays/${item.id}`)}
              style={({ pressed }) => ({
                padding: 18,
                borderRadius: 18,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }} numberOfLines={1}>
                {item.title}
              </Text>
              {item.content?.trim() ? (
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 6 }} numberOfLines={2}>
                  {previewText(item.content)}
                </Text>
              ) : null}
              <Text style={{ color: colors.textSubtle, fontSize: 11, marginTop: 10 }}>
                {formatDate(item.updatedAt)}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  )
}
