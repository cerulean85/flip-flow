import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider, useAuth } from "@/lib/auth"
import { ThemeProvider, useTheme } from "@/lib/theme"

function ProtectedNavigator() {
  const { user, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    const inAuthGroup = segments[0] === "(auth)"
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login")
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)")
    }
  }, [user, isLoading, segments, router])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animation: "slide_from_right",
      }}
    />
  )
}

function ThemedShell() {
  const { resolved, colors } = useTheme()
  return (
    <>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} backgroundColor={colors.bg} />
      <ProtectedNavigator />
    </>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ThemedShell />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
