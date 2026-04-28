import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { COLORS } from "../lib/constants"

interface CardFormProps {
  onSubmit: (data: { front: string; back: string }) => Promise<void>
}

export default function CardForm({ onSubmit }: CardFormProps) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!front.trim() || !back.trim() || loading) return
    setLoading(true)
    try {
      await onSubmit({ front: front.trim(), back: back.trim() })
      setFront("")
      setBack("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 카드 추가</Text>
      <TextInput
        style={styles.input}
        value={front}
        onChangeText={setFront}
        placeholder="앞면 (질문/단어)"
        placeholderTextColor={COLORS.textMuted}
        multiline
      />
      <TextInput
        style={styles.input}
        value={back}
        onChangeText={setBack}
        placeholder="뒷면 (답/뜻)"
        placeholderTextColor={COLORS.textMuted}
        multiline
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!front.trim() || !back.trim() || loading}
        style={[
          styles.submitButton,
          (!front.trim() || !back.trim() || loading) && styles.submitDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.submitText}>추가</Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 44,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
})
