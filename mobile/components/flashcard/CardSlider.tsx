import { useEffect, useState } from "react"
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import FlipCard from "./FlipCard"
import BookmarkButton from "./BookmarkButton"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

interface Props {
  cards: Card[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CardSlider({ cards }: Props) {
  const { colors } = useTheme()
  const [localCards, setLocalCards] = useState<Card[]>(cards)
  const [shuffled, setShuffled] = useState<Card[]>(cards)
  const [studyBackFirst, setStudyBackFirst] = useState(false)
  const [index, setIndex] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [frontDraft, setFrontDraft] = useState("")
  const [backDraft, setBackDraft] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLocalCards(cards)
    setShuffled(shuffle(cards))
    setIndex(0)
  }, [cards])

  const shuffledCard = shuffled[index]
  const card = shuffledCard
    ? localCards.find((c) => c.id === shuffledCard.id) ?? shuffledCard
    : undefined
  if (!card) return null

  const front = studyBackFirst ? card.back : card.front
  const back = studyBackFirst ? card.front : card.back

  const reshuffle = () => {
    setEditOpen(false)
    setShuffled(shuffle(localCards))
    setIndex(0)
  }

  const toggleStudySide = () => {
    setEditOpen(false)
    setStudyBackFirst((current) => !current)
  }

  const paginate = (dir: 1 | -1) => {
    const next = index + dir
    if (next < 0 || next >= shuffled.length) return
    setEditOpen(false)
    setIndex(next)
  }

  const openEdit = () => {
    setFrontDraft(card.front)
    setBackDraft(card.back)
    setEditOpen(true)
  }

  const saveEdit = async () => {
    const nextFront = frontDraft.trim()
    const nextBack = backDraft.trim()
    if (!nextFront || !nextBack || saving) return

    setSaving(true)
    try {
      const { card: updatedCard } = await api.updateCard(card.id, {
        front: nextFront,
        back: nextBack,
      })
      setLocalCards((current) =>
        current.map((item) => (item.id === updatedCard.id ? updatedCard : item))
      )
      setShuffled((current) =>
        current.map((item) => (item.id === updatedCard.id ? updatedCard : item))
      )
      setEditOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.textSubtle, fontWeight: "500", fontSize: 13 }}>
          {index + 1} / {shuffled.length}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={toggleStudySide}
            accessibilityRole="switch"
            accessibilityState={{ checked: studyBackFirst }}
            accessibilityLabel="학습 기준 전환"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingVertical: 6,
              paddingHorizontal: 9,
              backgroundColor: studyBackFirst ? colors.primarySoft : colors.card,
            }}
            hitSlop={8}
          >
            <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
              {studyBackFirst ? "뒷면 기준" : "앞면 기준"}
            </Text>
          </Pressable>
          <Pressable
            onPress={reshuffle}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            hitSlop={8}
          >
            <Ionicons name="shuffle" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 12 }}>다시 섞기</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8 }}>
        <Pressable
          onPress={() => paginate(-1)}
          disabled={index === 0}
          style={{ flexDirection: "row", alignItems: "center", gap: 4, opacity: index === 0 ? 0.4 : 1 }}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>이전</Text>
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />
          <Pressable onPress={openEdit} hitSlop={8} style={{ padding: 8 }} accessibilityLabel="카드 수정">
            <Ionicons name="pencil" size={17} color={colors.primary} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            opacity: index === shuffled.length - 1 ? 0.4 : 1,
          }}
          hitSlop={8}
        >
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>다음</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <View
        style={{
          height: 4,
          backgroundColor: colors.cardAlt,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${((index + 1) / shuffled.length) * 100}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      </View>

      <FlipCard
        key={`${card.id}-${studyBackFirst ? "back" : "front"}`}
        deckId={card.deckId}
        front={front}
        back={back}
      />

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOpen(false)}
      >
        <Pressable
          onPress={() => setEditOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 1,
              borderColor: colors.border,
              padding: 16,
              paddingBottom: 28,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700" }}>카드 수정</Text>
              <Pressable onPress={() => setEditOpen(false)} hitSlop={8} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color={colors.textSubtle} />
              </Pressable>
            </View>
            <TextInput
              value={frontDraft}
              onChangeText={setFrontDraft}
              multiline
              placeholder="앞면 (질문)"
              placeholderTextColor={colors.textSubtle}
              style={{
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 12,
                minHeight: 76,
                textAlignVertical: "top",
              }}
            />
            <TextInput
              value={backDraft}
              onChangeText={setBackDraft}
              multiline
              placeholder="뒷면 (답)"
              placeholderTextColor={colors.textSubtle}
              style={{
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 12,
                minHeight: 92,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 2 }}>
              <Pressable
                onPress={() => setEditOpen(false)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "600" }}>취소</Text>
              </Pressable>
              <Pressable
                onPress={saveEdit}
                disabled={saving || !frontDraft.trim() || !backDraft.trim()}
                style={{
                  minWidth: 64,
                  alignItems: "center",
                  backgroundColor: colors.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  opacity: saving || !frontDraft.trim() || !backDraft.trim() ? 0.55 : 1,
                }}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.primaryFg} />
                ) : (
                  <Text style={{ color: colors.primaryFg, fontSize: 13, fontWeight: "700" }}>저장</Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
