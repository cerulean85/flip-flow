import { useState } from "react"
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card, Deck } from "@/lib/types"

interface Props {
  index: number
  card: Card
  otherDecks: Deck[]
  onChanged?: () => void
}

export default function CardListItem({ index, card, otherDecks, onChanged }: Props) {
  const { colors } = useTheme()
  const [editing, setEditing] = useState(false)
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [pending, setPending] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)

  const save = async () => {
    setPending(true)
    try {
      await api.updateCard(card.id, { front: front.trim(), back: back.trim() })
      setEditing(false)
      onChanged?.()
    } finally {
      setPending(false)
    }
  }

  const remove = () => {
    Alert.alert("카드 삭제", "이 카드를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await api.deleteCard(card.id)
          onChanged?.()
        },
      },
    ])
  }

  const moveTo = async (toDeckId: string) => {
    setMoveOpen(false)
    await api.moveCard(card.id, toDeckId)
    onChanged?.()
  }

  if (editing) {
    return (
      <View
        style={{
          padding: 14,
          borderRadius: 14,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 8,
        }}
      >
        <TextInput
          value={front}
          onChangeText={setFront}
          multiline
          style={{
            color: colors.text,
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 10,
            minHeight: 60,
            textAlignVertical: "top",
          }}
        />
        <TextInput
          value={back}
          onChangeText={setBack}
          multiline
          style={{
            color: colors.text,
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 10,
            minHeight: 60,
            textAlignVertical: "top",
          }}
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={save}
            disabled={pending}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: colors.primaryFg, fontSize: 13 }}>{pending ? "저장 중..." : "저장"}</Text>
          </Pressable>
          <Pressable
            onPress={() => setEditing(false)}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>취소</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        padding: 14,
        borderRadius: 14,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text style={{ color: colors.textSubtle, fontSize: 12, width: 22 }}>{index + 1}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: "500" }} numberOfLines={1}>
          {card.front}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13 }} numberOfLines={1}>
          {card.back}
        </Text>
      </View>
      {card.isBookmark && <Ionicons name="star" size={14} color={colors.star} />}
      <Pressable onPress={() => setEditing(true)} hitSlop={6} style={{ padding: 6 }}>
        <Ionicons name="pencil" size={16} color={colors.textSubtle} />
      </Pressable>
      {otherDecks.length > 0 && (
        <Pressable onPress={() => setMoveOpen((v) => !v)} hitSlop={6} style={{ padding: 6 }}>
          <Ionicons name="arrow-forward" size={16} color={colors.textSubtle} />
        </Pressable>
      )}
      <Pressable onPress={remove} hitSlop={6} style={{ padding: 6 }}>
        <Ionicons name="trash" size={16} color={colors.textSubtle} />
      </Pressable>

      <Modal
        visible={moveOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMoveOpen(false)}
      >
        <Pressable
          onPress={() => setMoveOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 1,
              borderColor: colors.border,
              paddingTop: 8,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
                marginVertical: 8,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>덱으로 이동</Text>
              <Pressable onPress={() => setMoveOpen(false)} hitSlop={8} style={{ padding: 6 }}>
                <Ionicons name="close" size={20} color={colors.textSubtle} />
              </Pressable>
            </View>
            {otherDecks.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => moveTo(d.id)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: pressed ? colors.cardAlt : "transparent",
                })}
              >
                <View
                  style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: d.color }}
                />
                <Text style={{ color: colors.text, fontSize: 14 }}>{d.title}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
