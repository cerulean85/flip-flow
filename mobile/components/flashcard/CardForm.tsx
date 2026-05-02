import { useState } from "react"
import { Text, TextInput, View } from "react-native"
import { api } from "@/lib/api"
import PrimaryButton from "@/components/ui/PrimaryButton"
import { useTheme } from "@/lib/theme"

interface Props {
  deckId: string
  onCreated?: () => void
}

export default function CardForm({ deckId, onCreated }: Props) {
  const { colors } = useTheme()
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [pending, setPending] = useState(false)

  const inputStyle = {
    width: "100%" as const,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 64,
    textAlignVertical: "top" as const,
  }

  const handleSubmit = async () => {
    if (!front.trim() || !back.trim()) return
    setPending(true)
    try {
      await api.createCard(deckId, { front: front.trim(), back: back.trim() })
      setFront("")
      setBack("")
      onCreated?.()
    } finally {
      setPending(false)
    }
  }

  return (
    <View style={{ gap: 8, marginTop: 16 }}>
      <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "600" }}>카드 추가</Text>
      <TextInput
        value={front}
        onChangeText={setFront}
        placeholder="앞면 (질문)"
        placeholderTextColor={colors.textSubtle}
        multiline
        style={inputStyle}
      />
      <TextInput
        value={back}
        onChangeText={setBack}
        placeholder="뒷면 (답)"
        placeholderTextColor={colors.textSubtle}
        multiline
        style={[inputStyle, { minHeight: 80 }]}
      />
      <PrimaryButton
        label={pending ? "추가 중..." : "+ 카드 추가"}
        onPress={handleSubmit}
        loading={pending}
        disabled={!front.trim() || !back.trim()}
        fullWidth
      />
    </View>
  )
}
