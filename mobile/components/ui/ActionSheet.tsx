import { Modal, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "@/lib/theme"
import { RADIUS, TYPE } from "@/lib/tokens.generated"

export interface ActionSheetOption {
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  selected?: boolean
  destructive?: boolean
  onPress: () => void
}

interface Props {
  visible: boolean
  title?: string
  options: ActionSheetOption[]
  onClose: () => void
}

export default function ActionSheet({ visible, title, options, onClose }: Props) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{ paddingHorizontal: 8, paddingBottom: Math.max(insets.bottom, 12), gap: 8 }}
        >
          <View style={{ backgroundColor: colors.card, borderRadius: RADIUS.lg, overflow: "hidden" }}>
            {title && (
              <Text
                style={{
                  ...TYPE.caption,
                  color: colors.textSubtle,
                  textAlign: "center",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                {title}
              </Text>
            )}
            {options.map((option, i) => {
              const color = option.destructive ? colors.danger : colors.text
              return (
                <Pressable
                  key={option.label}
                  onPress={() => {
                    onClose()
                    option.onPress()
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: option.selected }}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 18,
                    minHeight: 52,
                    backgroundColor: pressed ? colors.cardAlt : "transparent",
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                  })}
                >
                  {option.icon && (
                    <Ionicons name={option.icon} size={20} color={option.destructive ? colors.danger : colors.textMuted} />
                  )}
                  <Text style={{ ...TYPE.body, color, flex: 1, fontWeight: option.selected ? "700" : "400" }}>
                    {option.label}
                  </Text>
                  {option.selected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              )
            })}
          </View>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={({ pressed }) => ({
              backgroundColor: pressed ? colors.cardAlt : colors.card,
              borderRadius: RADIUS.lg,
              minHeight: 52,
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Text style={{ ...TYPE.body, color: colors.text, fontWeight: "700" }}>취소</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
