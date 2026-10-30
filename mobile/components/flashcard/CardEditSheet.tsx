import { useEffect, useState } from "react"
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import { RADIUS, TYPE } from "@/lib/tokens.generated"
import type { Card } from "@/lib/types"

interface Props {
  card: Card
  visible: boolean
  onClose: () => void
  onSaved: (card: Card) => void
}

export default function CardEditSheet({ card, visible, onClose, onSaved }: Props) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [frontDraft, setFrontDraft] = useState(card.front)
  const [backDraft, setBackDraft] = useState(card.back)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return
    setFrontDraft(card.front)
    setBackDraft(card.back)
    setError(null)
  }, [visible, card.front, card.back])

  const canSave = !saving && !!frontDraft.trim() && !!backDraft.trim()

  const save = async () => {
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const { card: updated } = await api.updateCard(card.id, { front: frontDraft.trim(), back: backDraft.trim() })
      onSaved(updated)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했어요. 다시 시도해 주세요.")
    } finally {
      setSaving(false)
    }
  }

  const input = {
    ...TYPE.body,
    color: colors.text,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    padding: 14,
    textAlignVertical: "top" as const,
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            gap: 14,
          }}
        >
          <View style={{ alignSelf: "center", width: 36, height: 5, borderRadius: 3, backgroundColor: colors.border }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...TYPE.title, color: colors.text, fontWeight: "700", flex: 1 }}>카드 수정</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="닫기"
              style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="close" size={22} color={colors.textSubtle} />
            </Pressable>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ ...TYPE.label, color: colors.textMuted }}>앞면</Text>
            <TextInput value={frontDraft} onChangeText={setFrontDraft} multiline style={{ ...input, minHeight: 76 }} />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ ...TYPE.label, color: colors.textMuted }}>뒷면</Text>
            <TextInput value={backDraft} onChangeText={setBackDraft} multiline style={{ ...input, minHeight: 92 }} />
          </View>
          {error && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={{ ...TYPE.caption, color: colors.danger }}>{error}</Text>
            </View>
          )}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              style={{ flex: 1, minHeight: 48, borderRadius: RADIUS.md, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ ...TYPE.label, fontSize: 16, color: colors.text, fontWeight: "600" }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={save}
              disabled={!canSave}
              accessibilityRole="button"
              style={{ flex: 1, minHeight: 48, borderRadius: RADIUS.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", opacity: canSave ? 1 : 0.55 }}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.primaryFg} />
              ) : (
                <Text style={{ ...TYPE.label, fontSize: 16, color: colors.primaryFg, fontWeight: "700" }}>저장</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
