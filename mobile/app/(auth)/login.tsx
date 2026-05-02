import { Platform, Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as AppleAuthentication from "expo-apple-authentication"
import { SafeAreaView } from "react-native-safe-area-context"
import Logo from "@/components/ui/Logo"
import { useAuth } from "@/lib/auth"
import { useTheme } from "@/lib/theme"

export default function LoginScreen() {
  const {
    isAppleSignInAvailable,
    isAppleSignInChecked,
    signInWithApple,
    signInWithGoogle,
  } = useAuth()
  const { colors } = useTheme()
  const showAppleSignIn = !isAppleSignInChecked || isAppleSignInAvailable
  const showAppleFallback = isAppleSignInChecked && !isAppleSignInAvailable

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View
          style={{
            width: "100%",
            maxWidth: 360,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 28,
            alignItems: "center",
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 24,
            elevation: 6,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Logo size={64} />
          <Text style={{ marginTop: 16, fontSize: 26, fontWeight: "700", color: colors.primarySoftText }}>
            Flip & Flow
          </Text>
          <Text style={{ marginTop: 6, fontSize: 13, color: colors.textMuted, textAlign: "center" }}>
            복잡함은 덜어내고, 암기의 흐름만 남기다.
          </Text>

          {showAppleSignIn && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={14}
              style={{ marginTop: 28, width: "100%", height: 48 }}
              onPress={signInWithApple}
            />
          )}

          {showAppleFallback && (
            <Pressable
              onPress={signInWithApple}
              style={({ pressed }) => ({
                marginTop: 28,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                alignSelf: "stretch",
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 14,
                backgroundColor: colors.text,
                opacity: pressed ? 0.75 : Platform.OS === "ios" ? 1 : 0.55,
              })}
            >
              <Ionicons name="logo-apple" size={19} color={colors.bg} />
              <Text style={{ color: colors.bg, fontWeight: "700" }}>Apple로 로그인</Text>
            </Pressable>
          )}

          <Pressable
            onPress={signInWithGoogle}
            style={({ pressed }) => ({
              marginTop: showAppleSignIn || showAppleFallback ? 12 : 28,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              alignSelf: "stretch",
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: pressed ? colors.cardAlt : colors.card,
            })}
          >
            <Ionicons name="logo-google" size={18} color={colors.text} />
            <Text style={{ color: colors.text, fontWeight: "600" }}>Google로 로그인</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
