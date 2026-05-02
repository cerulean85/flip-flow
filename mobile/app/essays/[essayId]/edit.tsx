import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import EssayEditor from "@/components/essay/EssayEditor"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Essay } from "@/lib/types"

export default function EditEssayScreen() {
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
      .finally(() => setLoading(false))
  }, [essayId])

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="에세이 수정"
        fallback={essayId ? `/essays/${essayId}` : "/(tabs)/essays"}
      />
      {loading || !essay ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <EssayEditor
            initial={{ title: essay.title, content: essay.content }}
            submitLabel="저장"
            onSubmit={async (data) => {
              await api.updateEssay(essay.id, data)
              router.replace(`/essays/${essay.id}`)
            }}
            onCancel={() => router.back()}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
