import { Text } from "react-native"
import Markdown, { type RenderRules } from "react-native-markdown-display"
import { normalizeEssayMarkdown } from "@/lib/markdown"
import type { ThemeColors } from "@/lib/theme"

interface Props {
  children: string
  colors: ThemeColors
}

const rules: RenderRules = {
  strong: (node, children, _parent, styles) => (
    <Text key={node.key} style={styles.strong}>
      {children}
    </Text>
  ),
}

export default function EssayMarkdown({ children, colors }: Props) {
  const normalizedMarkdown = normalizeEssayMarkdown(children)

  return (
    <Markdown
      rules={rules}
      style={{
        body: { color: colors.text, fontSize: 15, lineHeight: 22 },
        heading1: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 12 },
        heading2: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 10 },
        heading3: { color: colors.text, fontSize: 16, fontWeight: "600", marginTop: 8 },
        strong: { color: colors.text, fontWeight: "bold" },
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
      {normalizedMarkdown}
    </Markdown>
  )
}
