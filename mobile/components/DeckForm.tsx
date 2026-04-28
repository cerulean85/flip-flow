import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { COLORS, DECK_COLORS } from "../lib/constants"

interface DeckFormProps {
  initialTitle?: string
  initialDescription?: string
  initialColor?: string
  onSubmit: (data: { title: string; description?: string; color: string }) => Promise<void>
  submitLabel: string
}

export default function DeckForm({
  initialTitle = "",
  initialDescription = "",
  initialColor = DECK_COLORS[0],
  onSubmit,
  submitLabel,
}: DeckFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [color, setColor] = useState(initialColor)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || loading) return
    setLoading(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined, color })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="덱 이름을 입력하세요"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={styles.label}>설명 (선택)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="덱에 대한 설명을 추가하세요"
        placeholderTextColor={COLORS.textMuted}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>색상</Text>
      <View style={styles.colorPicker}>
        {DECK_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorCircle,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
          />
        ))}
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={!title.trim() || loading}
        style={[styles.submitButton, (!title.trim() || loading) && styles.submitDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  colorPicker: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
