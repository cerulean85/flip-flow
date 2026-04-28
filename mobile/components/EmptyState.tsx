import { View, Text, StyleSheet } from "react-native"
import { COLORS } from "../lib/constants"

interface EmptyStateProps {
  emoji: string
  title: string
  subtitle?: string
}

export default function EmptyState({ emoji, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
})
