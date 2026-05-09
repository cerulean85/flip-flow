import { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import FlipCard from "./FlipCard"
import BookmarkButton from "./BookmarkButton"
import { useTheme } from "@/lib/theme"
import type { Card } from "@/lib/types"

interface Props {
  cards: Card[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CardSlider({ cards }: Props) {
  const { colors } = useTheme()
  const [shuffled, setShuffled] = useState<Card[]>(cards)
  const [reversedMap, setReversedMap] = useState<Record<string, boolean>>({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setShuffled(shuffle(cards))
    const map: Record<string, boolean> = {}
    cards.forEach((c) => {
      map[c.id] = Math.random() < 0.5
    })
    setReversedMap(map)
    setIndex(0)
  }, [cards])

  const card = shuffled[index]
  if (!card) return null

  const isReversed = reversedMap[card.id] ?? false
  const front = isReversed ? card.back : card.front
  const back = isReversed ? card.front : card.back

  const reshuffle = () => {
    setShuffled(shuffle(cards))
    const map: Record<string, boolean> = {}
    cards.forEach((c) => {
      map[c.id] = Math.random() < 0.5
    })
    setReversedMap(map)
    setIndex(0)
  }

  const paginate = (dir: 1 | -1) => {
    const next = index + dir
    if (next < 0 || next >= shuffled.length) return
    setIndex(next)
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.textSubtle, fontWeight: "500", fontSize: 13 }}>
          {index + 1} / {shuffled.length}
        </Text>
        <Pressable
          onPress={reshuffle}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          hitSlop={8}
        >
          <Ionicons name="shuffle" size={14} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 12 }}>다시 섞기</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8 }}>
        <Pressable
          onPress={() => paginate(-1)}
          disabled={index === 0}
          style={{ flexDirection: "row", alignItems: "center", gap: 4, opacity: index === 0 ? 0.4 : 1 }}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>이전</Text>
        </Pressable>

        <BookmarkButton cardId={card.id} isBookmark={card.isBookmark} />

        <Pressable
          onPress={() => paginate(1)}
          disabled={index === shuffled.length - 1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            opacity: index === shuffled.length - 1 ? 0.4 : 1,
          }}
          hitSlop={8}
        >
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}>다음</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <View
        style={{
          height: 4,
          backgroundColor: colors.cardAlt,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${((index + 1) / shuffled.length) * 100}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      </View>

      <FlipCard key={card.id} deckId={card.deckId} front={front} back={back} />
    </View>
  )
}
