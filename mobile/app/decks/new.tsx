import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { createDeck } from "../../lib/api"
import { COLORS } from "../../lib/constants"
import DeckForm from "../../components/DeckForm"

export default function NewDeckScreen() {
  const router = useRouter()

  const handleSubmit = async (data: { title: string; description?: string; color: string }) => {
    const deck = await createDeck(data)
    router.replace(`/decks/${deck.id}`)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>

      <Text style={styles.title}>새 덱 만들기</Text>

      <DeckForm onSubmit={handleSubmit} submitLabel="만들기" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
})
