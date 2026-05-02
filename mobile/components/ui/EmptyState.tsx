import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { useTheme } from "@/lib/theme"

interface Props {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
  description?: string
}

export default function EmptyState({ icon = "albums-outline", title, description }: Props) {
  const { colors } = useTheme()
  return (
    <View style={{ alignItems: "center", paddingVertical: 64, paddingHorizontal: 24 }}>
      <Ionicons name={icon} size={56} color={colors.textSubtle} />
      <Text style={{ marginTop: 12, fontSize: 14, color: colors.textMuted, textAlign: "center" }}>
        {title}
      </Text>
      {description && (
        <Text style={{ marginTop: 4, fontSize: 13, color: colors.textSubtle, textAlign: "center" }}>
          {description}
        </Text>
      )}
    </View>
  )
}
