import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native"
import { useState } from "react"
import { useAuth } from "../../lib/auth"
import { COLORS } from "../../lib/constants"

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn()
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🔄</Text>
          </View>
          <Text style={styles.title}>Flip & Flow</Text>
          <Text style={styles.subtitle}>
            복잡함은 덜어내고, 암기의 흐름만 남기다.
          </Text>
        </View>

        {/* Sign in button */}
        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={[styles.signInButton, loading && styles.signInDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textPrimary} />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.signInText}>Google로 로그인</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 40,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  signInDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  signInText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
})
