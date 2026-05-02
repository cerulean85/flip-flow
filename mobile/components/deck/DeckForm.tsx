import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import PrimaryButton from "@/components/ui/PrimaryButton"
import { DECK_COLORS } from "@/lib/constants"
import { useTheme } from "@/lib/theme"

interface Props {
  initial?: { title: string; description: string; color: string }
  submitLabel: string
  pendingLabel?: string
  onSubmit: (data: { title: string; description: string; color: string }) => Promise<void> | void
  onCancel?: () => void
}

export default function DeckForm({ initial, submitLabel, pendingLabel = "저장 중...", onSubmit, onCancel }: Props) {
  const { colors } = useTheme()
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [color, setColor] = useState(initial?.color ?? DECK_COLORS[0])
  const [pending, setPending] = useState(false)

  const inputStyle = {
    width: "100%" as const,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setPending(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), color })
    } finally {
      setPending(false)
    }
  }

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>제목 *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="덱 이름을 입력하세요"
          placeholderTextColor={colors.textSubtle}
          style={inputStyle}
        />
      </View>
      <View style={{ gap: 6 }}>
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>설명</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="덱에 대한 설명 (선택)"
          placeholderTextColor={colors.textSubtle}
          multiline
          style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>색상</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {DECK_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: c,
                borderWidth: color === c ? 3 : 0,
                borderColor: colors.text,
              }}
            />
          ))}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        {onCancel && (
          <PrimaryButton label="취소" variant="secondary" onPress={onCancel} fullWidth={false} />
        )}
        <View style={{ flex: 1 }}>
          <PrimaryButton
            label={pending ? pendingLabel : submitLabel}
            onPress={handleSubmit}
            loading={pending}
            disabled={!title.trim()}
            fullWidth
          />
        </View>
      </View>
    </View>
  )
}
