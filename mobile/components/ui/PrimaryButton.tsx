import { ActivityIndicator, Pressable, Text } from "react-native"
import { useTheme } from "@/lib/theme"

interface Props {
  label: string
  onPress?: () => void
  loading?: boolean
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
  fullWidth?: boolean
}

export default function PrimaryButton({
  label,
  onPress,
  loading,
  variant = "primary",
  disabled,
  fullWidth,
}: Props) {
  const { colors } = useTheme()
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "danger"
      ? colors.danger
      : colors.cardAlt
  const fg =
    variant === "secondary" ? colors.text : variant === "danger" ? colors.dangerFg : colors.primaryFg
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: bg,
        opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: fullWidth ? "stretch" : "flex-start",
      })}
    >
      {loading && <ActivityIndicator size="small" color={fg} style={{ marginRight: 8 }} />}
      <Text style={{ color: fg, fontWeight: "600", fontSize: 14 }}>{label}</Text>
    </Pressable>
  )
}
