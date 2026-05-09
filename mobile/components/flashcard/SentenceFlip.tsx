import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Animated, Easing, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { api } from "@/lib/api"
import { speak } from "@/lib/speech"
import { useTheme } from "@/lib/theme"

interface Props {
  deckId: string
  ko: string
  en: string
  index: number
}

export default function SentenceFlip({ deckId, ko, en, index }: Props) {
  const { colors } = useTheme()
  const [flipped, setFlipped] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const value = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(value, {
      toValue: flipped ? 180 : 0,
      duration: 350,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start()
  }, [flipped, value])

  useEffect(() => {
    if (!saved) return
    const timeout = setTimeout(() => setSaved(false), 1800)
    return () => clearTimeout(timeout)
  }, [saved])

  const frontInterpolate = value.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] })
  const backInterpolate = value.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] })
  const frontOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [1, 1, 0, 0] })
  const backOpacity = value.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [0, 0, 1, 1] })

  const handleSpeak = () => speak(flipped ? en : ko, flipped ? "en-US" : "ko-KR")
  const handleCreateCard = async () => {
    if (saving) return

    setSaving(true)
    try {
      await api.createCard(deckId, { front: en, back: ko })
      setSaved(true)
    } catch (e) {
      console.warn("[sentence/create-card]", e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Pressable
      onPress={() => setFlipped((f) => !f)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: pressed ? colors.cardAlt : "transparent",
      })}
    >
      <Text style={{ width: 18, color: colors.textSubtle, fontSize: 13, paddingTop: 2 }}>{index + 1}.</Text>
      <View style={{ flex: 1, minHeight: 22 }}>
        <Animated.View style={{ opacity: frontOpacity, transform: [{ rotateY: frontInterpolate }] }}>
          <Text style={{ color: colors.text, fontSize: 14, lineHeight: 22 }}>{ko}</Text>
        </Animated.View>
        <Animated.View
          style={{
            opacity: backOpacity,
            transform: [{ rotateY: backInterpolate }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Text style={{ color: colors.primarySoftText, fontSize: 14, lineHeight: 22 }}>{en}</Text>
        </Animated.View>
      </View>
      <Pressable
        onPress={handleCreateCard}
        disabled={saving}
        hitSlop={8}
        style={{ padding: 4, opacity: saving ? 0.6 : 1 }}
        accessibilityLabel={saved ? "카드에 추가됨" : "카드에 추가"}
      >
        {saving ? (
          <ActivityIndicator size="small" color={colors.textSubtle} />
        ) : (
          <Ionicons
            name={saved ? "checkmark-outline" : "add-outline"}
            size={16}
            color={colors.textSubtle}
          />
        )}
      </Pressable>
      <Pressable onPress={handleSpeak} hitSlop={8} style={{ padding: 4 }} accessibilityLabel="읽기">
        <Ionicons name="volume-medium-outline" size={16} color={colors.textSubtle} />
      </Pressable>
    </Pressable>
  )
}
