import { ReactNode } from "react"
import { Pressable, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/lib/theme"

interface Props {
  title?: string
  fallback?: string
  right?: ReactNode
}

export default function ScreenHeader({ title, fallback = "/(tabs)", right }: Props) {
  const { colors } = useTheme()
  const router = useRouter()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
    >
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.replace(fallback as never)
          }
        }}
        hitSlop={10}
        style={({ pressed }) => ({
          padding: 6,
          borderRadius: 8,
          backgroundColor: pressed ? colors.cardAlt : "transparent",
        })}
        accessibilityLabel="뒤로 가기"
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </Pressable>
      <Text
        numberOfLines={1}
        style={{ flex: 1, fontSize: 17, fontWeight: "700", color: colors.text }}
      >
        {title}
      </Text>
      {right}
    </View>
  )
}
