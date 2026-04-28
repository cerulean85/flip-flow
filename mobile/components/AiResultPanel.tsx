import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import Markdown from "react-native-markdown-display"
import { COLORS } from "../lib/constants"

interface AiResultPanelProps {
  result: string
  onClose: () => void
}

export default function AiResultPanel({ result, onClose }: AiResultPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>✨ AI 검색 결과</Text>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Markdown style={markdownStyles}>{result}</Markdown>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 16,
    maxHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  close: {
    fontSize: 14,
    color: COLORS.textMuted,
    padding: 4,
  },
  body: {
    flex: 1,
  },
})

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  em: {
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },
})
