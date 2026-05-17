import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

interface Props {
  index: number
  card: Card
  onChanged?: () => void
}

export default function CardListItem({ index, card, onChanged }: Props) {
  const { colors } = useTheme()
  const [editing, setEditing] = useState(false)
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [category, setCategory] = useState(card.category ?? "")
  const [pending, setPending] = useState(false)

  const save = async () => {
    setPending(true)
    try {
      await api.updateCard(card.id, {
        front: front.trim(),
        back: back.trim(),
        category: category.trim() || null,
      })
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

  if (editing) {
    const inputStyle = {
      color: colors.text,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 10,
      minHeight: 60,
      textAlignVertical: "top" as const,
    }
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
          value={category}
          onChangeText={setCategory}
          placeholder="카테고리 (선택)"
          placeholderTextColor={colors.textSubtle}
          style={[inputStyle, { minHeight: 40 }]}
        />
        <TextInput value={front} onChangeText={setFront} multiline style={inputStyle} />
        <TextInput value={back} onChangeText={setBack} multiline style={inputStyle} />
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
        {card.category && (
          <Text style={{ color: colors.textSubtle, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
            {card.category}
          </Text>
        )}
      </View>
      {card.isBookmark && <Ionicons name="star" size={14} color={colors.star} />}
      <Pressable onPress={() => setEditing(true)} hitSlop={6} style={{ padding: 6 }}>
        <Ionicons name="pencil" size={16} color={colors.textSubtle} />
      </Pressable>
      <Pressable onPress={remove} hitSlop={6} style={{ padding: 6 }}>
        <Ionicons name="trash" size={16} color={colors.textSubtle} />
      </Pressable>
    </View>
  )
}
