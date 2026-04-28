import { useState } from "react"
import { Pressable, Text, StyleSheet } from "react-native"
import { toggleBookmark } from "../lib/api"

interface BookmarkButtonProps {
  cardId: string
  isBookmark: boolean
  onToggled?: (newValue: boolean) => void
}

export default function BookmarkButton({ cardId, isBookmark, onToggled }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmark)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (loading) return
    const next = !bookmarked
    setBookmarked(next) // optimistic
    setLoading(true)

    try {
      await toggleBookmark(cardId)
      onToggled?.(next)
    } catch {
      setBookmarked(!next) // revert
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pressable onPress={handleToggle} style={styles.button}>
      <Text style={styles.icon}>{bookmarked ? "⭐" : "☆"}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 22,
  },
})
