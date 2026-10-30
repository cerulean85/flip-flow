import { useEffect, useMemo, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import FlipCard from "./FlipCard"
import StudyHelperPanel from "./StudyHelperPanel"
import CardEditSheet from "./CardEditSheet"
import ActionSheet from "@/components/ui/ActionSheet"
import { categoryColor } from "@/lib/category"
import { useTheme } from "@/lib/theme"
import { RADIUS, TYPE } from "@/lib/tokens.generated"
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
  const [localCards, setLocalCards] = useState<Card[]>(cards)
  const [category, setCategory] = useState<string | null>(null)
  const [order, setOrder] = useState<string[]>(() => shuffle(cards).map((c) => c.id))
  const [index, setIndex] = useState(0)
  const [studyBackFirst, setStudyBackFirst] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of localCards) if (c.category) counts.set(c.category, (counts.get(c.category) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [localCards])

  const reorder = (source: Card[], nextCategory: string | null) => {
    const pool = nextCategory ? source.filter((c) => c.category === nextCategory) : source
    setOrder(shuffle(pool).map((c) => c.id))
    setIndex(0)
  }

  useEffect(() => {
    setLocalCards(cards)
    const stillExists = category && cards.some((c) => c.category === category)
    const nextCategory = stillExists ? category : null
    setCategory(nextCategory)
    reorder(cards, nextCategory)
    // Only reshuffle when the card list itself changes, not when the filter does
  }, [cards])

  const byId = useMemo(() => new Map(localCards.map((c) => [c.id, c])), [localCards])
  const card = order[index] ? byId.get(order[index]) : undefined
  if (!card) return null

  const total = order.length
  const front = studyBackFirst ? card.back : card.front
  const back = studyBackFirst ? card.front : card.back

  const paginate = (dir: 1 | -1) => {
    const next = index + dir
    if (next < 0 || next >= total) return
    setIndex(next)
  }

  const chooseCategory = (next: string | null) => {
    setCategory(next)
    reorder(localCards, next)
  }

  const onSaved = (updated: Card) => setLocalCards((current) => current.map((c) => (c.id === updated.id ? updated : c)))

  const navButton = (dir: 1 | -1) => {
    const disabled = dir === -1 ? index === 0 : index === total - 1
    const primary = dir === 1
    return (
      <Pressable
        onPress={() => paginate(dir)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={primary ? "다음 카드" : "이전 카드"}
        style={({ pressed }) => ({
          flex: 1,
          minHeight: 48,
          borderRadius: RADIUS.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary ? colors.primary : colors.card,
          borderWidth: primary ? 0 : 1,
          borderColor: colors.border,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ ...TYPE.body, fontWeight: "600", color: primary ? colors.primaryFg : colors.text }}>
          {primary ? "다음" : "이전"}
        </Text>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Top bar: progress · count · menu (DESIGN-RENEWAL 7: one line) */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 16, paddingRight: 4, minHeight: 48 }}>
        <View
          style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.cardAlt, overflow: "hidden" }}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: total, now: index + 1 }}
        >
          <View style={{ height: "100%", width: `${((index + 1) / total) * 100}%`, backgroundColor: colors.primary, borderRadius: 3 }} />
        </View>
        <Text style={{ ...TYPE.label, color: colors.textMuted }}>
          {index + 1} / {total}
        </Text>
        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="학습 메뉴"
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingBottom: 4 }}>
        <Pressable
          onPress={() => setCategoryOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="카테고리 선택"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            minHeight: 36,
            paddingHorizontal: 14,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          {category && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: categoryColor(category) }} />}
          <Text style={{ ...TYPE.label, color: colors.textMuted }}>
            {category ?? "전체 카테고리"} · {total}장
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
        <FlipCard
          key={`${card.id}-${studyBackFirst ? "back" : "front"}`}
          cardId={card.id}
          isBookmark={card.isBookmark}
          category={card.category}
          front={front}
          back={back}
          frontLang={studyBackFirst ? "ko-KR" : "en-US"}
          onSwipe={paginate}
        />
        <StudyHelperPanel key={card.id} front={card.front} back={card.back} category={card.category} />
      </View>

      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        {navButton(-1)}
        {navButton(1)}
      </View>

      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        options={[
          { label: "다시 섞기", icon: "shuffle", onPress: () => reorder(localCards, category) },
          {
            label: studyBackFirst ? "앞면부터 보기" : "뒷면부터 보기",
            icon: "swap-horizontal",
            onPress: () => setStudyBackFirst((v) => !v),
          },
          // iOS drops a modal presented while another is still fading out
          { label: "이 카드 수정", icon: "create-outline", onPress: () => setTimeout(() => setEditOpen(true), 300) },
        ]}
      />
      <ActionSheet
        visible={categoryOpen}
        title="카테고리"
        onClose={() => setCategoryOpen(false)}
        options={[
          { label: `전체 카테고리 · ${localCards.length}장`, selected: category === null, onPress: () => chooseCategory(null) },
          ...categories.map(([name, count]) => ({
            label: `${name} · ${count}장`,
            selected: category === name,
            onPress: () => chooseCategory(name),
          })),
        ]}
      />
      <CardEditSheet card={card} visible={editOpen} onClose={() => setEditOpen(false)} onSaved={onSaved} />
    </View>
  )
}
