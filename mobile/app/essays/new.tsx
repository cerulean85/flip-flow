import { ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import EssayEditor from "@/components/essay/EssayEditor"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"

export default function NewEssayScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="새 에세이" fallback="/(tabs)/essays" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <EssayEditor
          submitLabel="발행"
          onSubmit={async (data) => {
            const { essay } = await api.createEssay(data)
            router.replace(`/essays/${essay.id}`)
          }}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
