import { Pressable, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/lib/theme"
import type { Deck } from "@/lib/types"

interface Props {
  deck: Deck & { _count?: { cards: number } }
}

export default function DeckCard({ deck }: Props) {
  const { colors } = useTheme()
  const router = useRouter()
  return (
    <Pressable
      onPress={() => router.push(`/decks/${deck.id}`)}
      style={({ pressed }) => ({
        borderRadius: 20,
        backgroundColor: colors.card,
        borderLeftWidth: 4,
        borderLeftColor: deck.color,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: colors.border,
        borderRightColor: colors.border,
        borderBottomColor: colors.border,
        padding: 18,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
        {deck.title}
      </Text>
      {deck.description ? (
        <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }} numberOfLines={2}>
          {deck.description}
        </Text>
      ) : null}
      <Text style={{ color: colors.textSubtle, fontSize: 11, marginTop: 12 }}>
        {deck._count?.cards ?? 0}장
      </Text>
    </Pressable>
  )
}
