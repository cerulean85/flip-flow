import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import EssayMarkdown from "@/components/essay/EssayMarkdown"
import EmptyState from "@/components/ui/EmptyState"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Essay } from "@/lib/types"

export default function EssayDetailScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { essayId } = useLocalSearchParams<{ essayId: string }>()
  const [essay, setEssay] = useState<Essay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!essayId) return
    api
      .getEssay(essayId)
      .then(({ essay }) => setEssay(essay))
      .catch((e) => console.warn("[essay/detail]", e))
      .finally(() => setLoading(false))
  }, [essayId])

  const onDelete = () => {
    if (!essay) return
    Alert.alert("에세이 삭제", "이 에세이를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await api.deleteEssay(essay.id)
          router.replace("/(tabs)/essays")
        },
      },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="에세이" fallback="/(tabs)/essays" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }
  if (!essay) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="에세이" fallback="/(tabs)/essays" />
        <EmptyState icon="alert-circle-outline" title="에세이를 찾을 수 없습니다." />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={essay.title}
        fallback="/(tabs)/essays"
        right={
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Pressable
              onPress={() => router.push(`/essays/${essay.id}/edit`)}
              hitSlop={8}
              style={{ padding: 6 }}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </Pressable>
            <Pressable onPress={onDelete} hitSlop={8} style={{ padding: 6 }}>
              <Ionicons name="trash" size={20} color={colors.danger} />
            </Pressable>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: colors.textSubtle, fontSize: 12 }}>
          {new Date(essay.updatedAt).toLocaleDateString("ko", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <View
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 18,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {essay.content.trim() ? (
            <EssayMarkdown colors={colors}>{essay.content}</EssayMarkdown>
          ) : (
            <Text style={{ color: colors.textSubtle, fontStyle: "italic" }}>내용이 비어 있습니다.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
