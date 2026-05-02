import { useState } from "react"
import { Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"

interface Props {
  cardId: string
  isBookmark: boolean
  size?: number
}

export default function BookmarkButton({ cardId, isBookmark, size = 28 }: Props) {
  const { colors } = useTheme()
  const [optimistic, setOptimistic] = useState(isBookmark)
  const [pending, setPending] = useState(false)

  const toggle = async () => {
    if (pending) return
    const next = !optimistic
    setOptimistic(next)
    setPending(true)
    try {
      await api.toggleBookmark(cardId)
    } catch {
      setOptimistic(!next)
    } finally {
      setPending(false)
    }
  }

  return (
    <Pressable onPress={toggle} hitSlop={8} accessibilityLabel={optimistic ? "북마크 해제" : "북마크 추가"}>
      <Ionicons
        name={optimistic ? "star" : "star-outline"}
        size={size}
        color={optimistic ? colors.star : colors.textSubtle}
      />
    </Pressable>
  )
}
