import { ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import DeckForm from "@/components/deck/DeckForm"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"

export default function NewDeckScreen() {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="새 덱 만들기" fallback="/(tabs)" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <DeckForm
          submitLabel="덱 만들기"
          onSubmit={async (data) => {
            const { deck } = await api.createDeck(data)
            router.replace(`/decks/${deck.id}`)
          }}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
