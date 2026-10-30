import { useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SentenceFlip from "./SentenceFlip"
import { api } from "@/lib/api"
import { useTheme } from "@/lib/theme"
import { RADIUS, TYPE } from "@/lib/tokens.generated"
import type { Sentence } from "@/lib/types"

type Tab = "sentences" | "definition"

type Loadable<T> = { status: "idle" } | { status: "loading" } | { status: "error"; message: string } | { status: "done"; data: T }

interface Props {
  // Card's own sides (not the study order), so AI requests stay the same either way round
  front: string
  back: string
  category?: string | null
}

const TABS: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "sentences", label: "예문", icon: "chatbubble-ellipses-outline" },
  { key: "definition", label: "뜻", icon: "sparkles-outline" },
]

export default function StudyHelperPanel({ front, back, category }: Props) {
  const { colors } = useTheme()
  const [open, setOpen] = useState<Tab | null>(null)
  const [sentences, setSentences] = useState<Loadable<Sentence[]>>({ status: "idle" })
  const [definition, setDefinition] = useState<Loadable<string>>({ status: "idle" })

  const loadSentences = async () => {
    setSentences({ status: "loading" })
    try {
      const { sentences: list } = await api.generateSentences(front, back)
      setSentences(list?.length ? { status: "done", data: list } : { status: "error", message: "예문을 만들지 못했어요." })
    } catch (e) {
      setSentences({ status: "error", message: e instanceof Error ? e.message : "네트워크 오류" })
    }
  }

  const loadDefinition = async () => {
    setDefinition({ status: "loading" })
    try {
      const { result } = await api.searchDefinition(front)
      setDefinition({ status: "done", data: result })
    } catch (e) {
      setDefinition({ status: "error", message: e instanceof Error ? e.message : "네트워크 오류" })
    }
  }

  const toggle = (tab: Tab) => {
    if (open === tab) {
      setOpen(null)
      return
    }
    setOpen(tab)
    if (tab === "sentences" && sentences.status === "idle") loadSentences()
    if (tab === "definition" && definition.status === "idle") loadDefinition()
  }

  const skeleton = (
    <View style={{ gap: 10 }} accessibilityLabel="불러오는 중">
      {[0.9, 0.7, 0.8].map((w, i) => (
        <View key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: RADIUS.sm, backgroundColor: colors.border }} />
      ))}
    </View>
  )

  const errorView = (message: string, retry: () => void) => (
    <View style={{ alignItems: "center", gap: 8, paddingVertical: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
        <Text style={{ ...TYPE.label, color: colors.text, fontWeight: "500" }}>불러오지 못했어요</Text>
      </View>
      <Text style={{ ...TYPE.caption, color: colors.textMuted, textAlign: "center" }}>{message}</Text>
      <Pressable
        onPress={retry}
        accessibilityRole="button"
        style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: RADIUS.md, borderWidth: 1, borderColor: colors.border, justifyContent: "center" }}
      >
        <Text style={{ ...TYPE.label, color: colors.text, fontWeight: "600" }}>다시 시도</Text>
      </Pressable>
    </View>
  )

  const body = () => {
    if (open === "sentences") {
      if (sentences.status === "loading" || sentences.status === "idle") return skeleton
      if (sentences.status === "error") return errorView(sentences.message, loadSentences)
      return (
        <View>
          <Text style={{ ...TYPE.caption, color: colors.textSubtle, marginBottom: 4 }}>
            문장을 탭하면 영어로 바뀌어요
          </Text>
          {sentences.data.map((s, i) => (
            <SentenceFlip key={i} category={category} ko={s.ko} en={s.en} index={i} />
          ))}
        </View>
      )
    }
    if (open === "definition") {
      if (definition.status === "loading" || definition.status === "idle") return skeleton
      if (definition.status === "error") return errorView(definition.message, loadDefinition)
      return (
        <View style={{ gap: 10 }}>
          <Text style={{ ...TYPE.label, color: colors.text }}>{definition.data}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="sparkles-outline" size={14} color={colors.textSubtle} />
            <Text style={{ ...TYPE.caption, color: colors.textSubtle }}>AI 뜻풀이</Text>
          </View>
        </View>
      )
    }
    return null
  }

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}>
      <View style={{ flexDirection: "row", gap: 4, padding: 4 }} accessibilityRole="tablist">
        {TABS.map((tab) => {
          const active = open === tab.key
          const color = active ? colors.primarySoftText : colors.textMuted
          return (
            <Pressable
              key={tab.key}
              onPress={() => toggle(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active, expanded: active }}
              style={{
                flex: 1,
                minHeight: 44,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderRadius: RADIUS.md,
                backgroundColor: active ? colors.primarySoft : "transparent",
              }}
            >
              <Ionicons name={tab.icon} size={18} color={color} />
              <Text style={{ ...TYPE.label, color, fontWeight: active ? "700" : "500" }}>{tab.label}</Text>
            </Pressable>
          )
        })}
      </View>
      {open && (
        <ScrollView
          style={{ maxHeight: 220, borderTopWidth: 1, borderTopColor: colors.border }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14 }}
        >
          {body()}
        </ScrollView>
      )}
    </View>
  )
}
