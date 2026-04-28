import { useState } from "react"
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native"
import { COLORS } from "../lib/constants"
import * as api from "../lib/api"
import type { Card, Deck } from "../lib/types"

interface CardListItemProps {
  card: Card
  index: number
  otherDecks: Deck[]
  onUpdated: () => void
}

export default function CardListItem({
  card,
  index,
  otherDecks,
  onUpdated,
}: CardListItemProps) {
  const [editing, setEditing] = useState(false)
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!front.trim() || !back.trim() || loading) return
    setLoading(true)
    try {
      await api.updateCard(card.id, { front: front.trim(), back: back.trim() })
      setEditing(false)
      onUpdated()
    } catch {
      Alert.alert("오류", "카드 수정에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert("카드 삭제", "이 카드를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteCard(card.id)
            onUpdated()
          } catch {
            Alert.alert("오류", "카드 삭제에 실패했습니다.")
          }
        },
      },
    ])
  }

  const handleMove = () => {
    if (otherDecks.length === 0) {
      Alert.alert("알림", "이동할 다른 덱이 없습니다.")
      return
    }

    Alert.alert(
      "카드 이동",
      "이동할 덱을 선택하세요",
      otherDecks.map((deck) => ({
        text: deck.title,
        onPress: async () => {
          try {
            await api.moveCard(card.id, deck.id)
            onUpdated()
          } catch {
            Alert.alert("오류", "카드 이동에 실패했습니다.")
          }
        },
      })).concat([{ text: "취소", onPress: () => {}, style: "cancel" } as any])
    )
  }

  const handleBookmark = async () => {
    try {
      await api.toggleBookmark(card.id)
      onUpdated()
    } catch {
      // ignore
    }
  }

  if (editing) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.editInput}
          value={front}
          onChangeText={setFront}
          placeholder="앞면"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <TextInput
          style={styles.editInput}
          value={back}
          onChangeText={setBack}
          placeholder="뒷면"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <View style={styles.editActions}>
          <Pressable onPress={() => setEditing(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>취소</Text>
          </Pressable>
          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>{loading ? "저장 중..." : "저장"}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.index}>{index + 1}</Text>
        <View style={styles.actions}>
          <Pressable onPress={handleBookmark} style={styles.actionButton}>
            <Text style={styles.actionIcon}>{card.isBookmark ? "⭐" : "☆"}</Text>
          </Pressable>
          <Pressable onPress={() => setEditing(true)} style={styles.actionButton}>
            <Text style={styles.actionIcon}>✏️</Text>
          </Pressable>
          <Pressable onPress={handleMove} style={styles.actionButton}>
            <Text style={styles.actionIcon}>📦</Text>
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗑</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.frontText} numberOfLines={2}>{card.front}</Text>
      <Text style={styles.backText} numberOfLines={2}>{card.back}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  index: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 14,
  },
  frontText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  backText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  editInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 40,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  cancelText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "600",
  },
})
