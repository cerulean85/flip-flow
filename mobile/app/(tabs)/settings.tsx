import { Alert, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/lib/auth"
import { POLICY_URL, SUPPORT_URL, TERMS_URL } from "@/lib/constants"
import { useTheme, type ThemeMode } from "@/lib/theme"

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "시스템" },
]

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme()
  const { deleteAccount, signOut } = useAuth()

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch {
      Alert.alert("링크 열기 실패", "잠시 뒤 다시 시도해주세요.")
    }
  }

  const confirmSignOut = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut()
            } catch (err) {
              Alert.alert("로그아웃 실패", err instanceof Error ? err.message : "잠시 뒤 다시 시도해주세요.")
            }
          },
        },
      ]
    )
  }

  const performDelete = async () => {
    try {
      await deleteAccount()
    } catch (err) {
      Alert.alert("삭제 실패", err instanceof Error ? err.message : "계정을 삭제하지 못했습니다.")
    }
  }

  const promptForConfirmation = () => {
    // Alert.prompt is iOS-only; on Android we fall back to a simple alert.
    if (Platform.OS === "ios") {
      Alert.prompt(
        "계정 삭제 확인",
        "계속하려면 아래 칸에 \"삭제\"를 입력해주세요.",
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: (input) => {
              if ((input ?? "").trim() !== "삭제") {
                Alert.alert("취소됨", "입력한 문구가 일치하지 않아 삭제가 취소되었습니다.")
                return
              }
              performDelete()
            },
          },
        ],
        "plain-text",
        ""
      )
    } else {
      Alert.alert(
        "계정 삭제",
        '계속하려면 다음 단계에서 "삭제"를 입력해주세요.',
        [
          { text: "취소", style: "cancel" },
          { text: "계속", style: "destructive", onPress: performDelete },
        ]
      )
    }
  }

  const confirmDeleteAccount = () => {
    Alert.alert(
      "계정 삭제",
      "계정과 저장된 덱, 카드, 에세이가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "계속", style: "destructive", onPress: promptForConfirmation },
      ]
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 4 }}>설정</Text>

      <View
        style={{
          padding: 18,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "600" }}>테마</Text>
        <Text style={{ color: colors.textSubtle, fontSize: 12 }}>앱 전체에 적용될 색 테마를 선택하세요.</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {THEME_OPTIONS.map(({ value, label }) => {
            const active = mode === value
            return (
              <Pressable
                key={value}
                onPress={() => setMode(value)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  alignItems: "center",
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    color: active ? colors.primaryFg : colors.textMuted,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View
        style={{
          padding: 18,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 6,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "600" }}>개인정보와 지원</Text>
        <Text style={{ color: colors.textSubtle, fontSize: 12, lineHeight: 18 }}>
          로그인 정보, 학습 콘텐츠, AI 요청 데이터 처리 방식을 확인할 수 있습니다.
        </Text>
        {[
          { label: "개인정보처리방침", icon: "shield-checkmark-outline" as const, url: POLICY_URL },
          { label: "이용약관", icon: "document-text-outline" as const, url: TERMS_URL },
          { label: "문의 및 지원", icon: "help-circle-outline" as const, url: SUPPORT_URL },
        ].map((item) => (
          <Pressable
            key={item.label}
            onPress={() => openUrl(item.url)}
            style={({ pressed }) => ({
              marginTop: 8,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name={item.icon} size={18} color={colors.textMuted} />
              <Text style={{ color: colors.text, fontWeight: "600" }}>{item.label}</Text>
            </View>
            <Ionicons name="open-outline" size={17} color={colors.textSubtle} />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={confirmSignOut}
        style={({ pressed }) => ({
          padding: 18,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={{ color: colors.danger, fontWeight: "600" }}>로그아웃</Text>
      </Pressable>

      <Pressable
        onPress={confirmDeleteAccount}
        style={({ pressed }) => ({
          padding: 18,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={{ color: colors.danger, fontWeight: "600" }}>계정 삭제</Text>
      </Pressable>
    </ScrollView>
  )
}
