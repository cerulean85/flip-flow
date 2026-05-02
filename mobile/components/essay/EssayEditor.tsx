import { useState } from "react"
import { Pressable, ScrollView, Text, TextInput, View } from "react-native"
import Markdown from "react-native-markdown-display"
import PrimaryButton from "@/components/ui/PrimaryButton"
import { useTheme } from "@/lib/theme"

interface Props {
  initial?: { title: string; content: string }
  submitLabel: string
  onSubmit: (data: { title: string; content: string }) => Promise<void> | void
  onCancel?: () => void
}

export default function EssayEditor({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const { colors } = useTheme()
  const [title, setTitle] = useState(initial?.title ?? "")
  const [content, setContent] = useState(initial?.content ?? "")
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [pending, setPending] = useState(false)

  const inputStyle = {
    width: "100%" as const,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  }

  const submit = async () => {
    if (!title.trim()) return
    setPending(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim() })
    } finally {
      setPending(false)
    }
  }

  return (
    <View style={{ gap: 12, flex: 1 }}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
        placeholderTextColor={colors.textSubtle}
        style={[inputStyle, { fontSize: 18, fontWeight: "600" }]}
      />

      <View
        style={{
          flexDirection: "row",
          padding: 4,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 4,
        }}
      >
        {(["edit", "preview"] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: mode === m ? colors.primary : "transparent",
            }}
          >
            <Text
              style={{
                color: mode === m ? colors.primaryFg : colors.textMuted,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {m === "edit" ? "편집" : "미리보기"}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === "edit" ? (
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="마크다운으로 작성하세요...&#10;&#10;예) # 제목&#10;**굵게** *기울임*&#10;- 리스트"
          placeholderTextColor={colors.textSubtle}
          multiline
          style={[inputStyle, { minHeight: 320, textAlignVertical: "top", fontFamily: "Menlo" }]}
        />
      ) : (
        <ScrollView
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            padding: 14,
            minHeight: 320,
          }}
        >
          {content.trim() ? (
            <Markdown
              style={{
                body: { color: colors.text, fontSize: 15, lineHeight: 22 },
                heading1: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 12 },
                heading2: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 10 },
                heading3: { color: colors.text, fontSize: 16, fontWeight: "600", marginTop: 8 },
                strong: { color: colors.text, fontWeight: "700" },
                em: { color: colors.textMuted, fontStyle: "italic" },
                blockquote: {
                  borderLeftColor: colors.primary,
                  borderLeftWidth: 3,
                  paddingLeft: 10,
                  color: colors.textMuted,
                  fontStyle: "italic",
                },
                code_inline: {
                  backgroundColor: colors.cardAlt,
                  color: colors.primarySoftText,
                  paddingHorizontal: 4,
                  borderRadius: 4,
                  fontFamily: "Menlo",
                },
                code_block: {
                  backgroundColor: colors.cardAlt,
                  color: colors.text,
                  padding: 10,
                  borderRadius: 8,
                  fontFamily: "Menlo",
                },
                fence: {
                  backgroundColor: colors.cardAlt,
                  color: colors.text,
                  padding: 10,
                  borderRadius: 8,
                  fontFamily: "Menlo",
                },
                link: { color: colors.primary },
                hr: { backgroundColor: colors.border, marginVertical: 12 },
                list_item: { color: colors.text },
              }}
            >
              {content}
            </Markdown>
          ) : (
            <Text style={{ color: colors.textSubtle, fontSize: 13, fontStyle: "italic" }}>
              내용이 비어 있습니다.
            </Text>
          )}
        </ScrollView>
      )}

      <View style={{ flexDirection: "row", gap: 8 }}>
        {onCancel && <PrimaryButton label="취소" variant="secondary" onPress={onCancel} />}
        <View style={{ flex: 1 }}>
          <PrimaryButton
            label={pending ? "저장 중..." : submitLabel}
            onPress={submit}
            loading={pending}
            disabled={!title.trim()}
            fullWidth
          />
        </View>
      </View>
    </View>
  )
}
