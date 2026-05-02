import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import CardForm from "@/components/flashcard/CardForm"
import CardListItem from "@/components/flashcard/CardListItem"
import DeckForm from "@/components/deck/DeckForm"
import EmptyState from "@/components/ui/EmptyState"
import ScreenHeader from "@/components/ui/ScreenHeader"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card, Deck } from "@/lib/types"

export default function DeckDetailScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [deck, setDeck] = useState<(Deck & { cards: Card[] }) | null>(null)
  const [otherDecks, setOtherDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [editDeckOpen, setEditDeckOpen] = useState(false)
  const [addCardOpen, setAddCardOpen] = useState(false)

  const load = useCallback(async () => {
    if (!deckId) return
    try {
      const { deck, otherDecks } = await api.getDeck(deckId)
      setDeck(deck)
      setOtherDecks(otherDecks)
    } catch (err) {
      console.warn("[deck] load", err)
    }
  }, [deckId])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const onDelete = () => {
    if (!deck) return
    Alert.alert("덱 삭제", "이 덱과 모든 카드를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await api.deleteDeck(deck.id)
          router.replace("/(tabs)")
        },
      },
    ])
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={deck?.title ?? "덱"}
        fallback="/(tabs)"
        right={
          deck ? (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Pressable
                onPress={() => setAddCardOpen(true)}
                hitSlop={8}
                style={{ padding: 6 }}
                accessibilityLabel="카드 추가"
              >
                <Ionicons name="add" size={24} color={colors.primary} />
              </Pressable>
              <Pressable
                onPress={() => setEditDeckOpen(true)}
                hitSlop={8}
                style={{ padding: 6 }}
                accessibilityLabel="덱 수정"
              >
                <Ionicons name="pencil" size={20} color={colors.textMuted} />
              </Pressable>
              <Pressable
                onPress={onDelete}
                hitSlop={8}
                style={{ padding: 6 }}
                accessibilityLabel="덱 삭제"
              >
                <Ionicons name="trash" size={20} color={colors.danger} />
              </Pressable>
            </View>
          ) : null
        }
      />

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !deck ? (
        <EmptyState icon="alert-circle-outline" title="덱을 찾을 수 없습니다." />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {deck.description ? (
            <Text style={{ color: colors.textMuted }}>{deck.description}</Text>
          ) : null}

          {deck.cards.length > 0 && (
            <Pressable
              onPress={() => router.push(`/decks/${deck.id}/study`)}
              style={({ pressed }) => ({
                marginTop: 16,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: pressed ? colors.accent : colors.primary,
                alignItems: "center",
              })}
            >
              <Text style={{ color: colors.primaryFg, fontWeight: "700" }}>학습 시작</Text>
            </Pressable>
          )}

          <View style={{ marginTop: 18, gap: 8 }}>
            {deck.cards.length === 0 ? (
              <EmptyState
                icon="file-tray-outline"
                title="아직 카드가 없어요."
                description="우측 상단 + 버튼으로 추가해보세요!"
              />
            ) : (
              deck.cards.map((c, i) => (
                <CardListItem
                  key={c.id}
                  index={i}
                  card={c}
                  otherDecks={otherDecks}
                  onChanged={load}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      {deck && (
        <FormModal
          visible={editDeckOpen}
          title="덱 수정"
          onClose={() => setEditDeckOpen(false)}
        >
          <DeckForm
            initial={{ title: deck.title, description: deck.description ?? "", color: deck.color }}
            submitLabel="저장"
            onSubmit={async (data) => {
              await api.updateDeck(deck.id, data)
              setEditDeckOpen(false)
              load()
            }}
            onCancel={() => setEditDeckOpen(false)}
          />
        </FormModal>
      )}

      {deck && (
        <FormModal
          visible={addCardOpen}
          title="카드 추가"
          onClose={() => setAddCardOpen(false)}
        >
          <CardForm
            deckId={deck.id}
            onCreated={() => {
              setAddCardOpen(false)
              load()
            }}
          />
        </FormModal>
      )}
    </SafeAreaView>
  )
}

function FormModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
      transparent={Platform.OS !== "ios"}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: colors.bg }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            paddingBottom: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={10} style={{ padding: 4 }} accessibilityLabel="닫기">
            <Ionicons name="close" size={24} color={colors.textMuted} />
          </Pressable>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}
