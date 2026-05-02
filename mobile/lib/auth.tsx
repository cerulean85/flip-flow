import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Alert, Platform } from "react-native"
import * as AppleAuthentication from "expo-apple-authentication"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { api, getStoredToken, setStoredToken } from "./api"
import type { User } from "./types"

WebBrowser.maybeCompleteAuthSession()

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAppleSignInAvailable: boolean
  isAppleSignInChecked: boolean
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAppleSignInAvailable: false,
  isAppleSignInChecked: false,
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] = useState(false)
  const [isAppleSignInChecked, setIsAppleSignInChecked] = useState(false)

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  })

  useEffect(() => {
    if (Platform.OS !== "ios") {
      setIsAppleSignInChecked(true)
      return
    }
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        setIsAppleSignInAvailable(available)
        setIsAppleSignInChecked(true)
      })
      .catch(() => {
        setIsAppleSignInAvailable(false)
        setIsAppleSignInChecked(true)
      })
  }, [])

  // Bootstrap: if we already have a stored token, optimistically assume signed in
  // (Real user info will be hydrated next time the API echoes it back via mobile token decode.)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = await getStoredToken()
      if (cancelled) return
      if (token) {
        // No /me endpoint exists; we keep token and treat user as signed in.
        // First successful API call will refresh state via signIn flow if needed.
        setUser((prev) => prev ?? { id: "", email: "", name: null, image: null })
      }
      setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // When Google auth completes, exchange id_token for our mobile JWT
  useEffect(() => {
    if (response?.type === "success" && response.params?.id_token) {
      ;(async () => {
        try {
          const { token, user: u } = await api.loginWithGoogle(response.params.id_token as string)
          await setStoredToken(token)
          setUser(u)
        } catch (err) {
          console.warn("[auth] login failed", err)
          Alert.alert("로그인 실패", err instanceof Error ? err.message : "Google 로그인에 실패했습니다.")
        }
      })()
    }
  }, [response])

  const signInWithGoogle = async () => {
    if (!request) {
      Alert.alert("로그인 준비 중", "잠시 뒤 다시 시도해주세요.")
      return
    }
    try {
      await promptAsync()
    } catch (err) {
      Alert.alert("로그인 실패", err instanceof Error ? err.message : "Google 로그인에 실패했습니다.")
    }
  }

  const signInWithApple = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Apple 로그인", "Apple 로그인은 iOS 앱 빌드에서 사용할 수 있습니다.")
      return
    }
    if (isAppleSignInChecked && !isAppleSignInAvailable) {
      Alert.alert("Apple 로그인", "현재 실행 환경에서 Apple 로그인을 사용할 수 없습니다. iOS dev build 또는 App Store 빌드에서 다시 확인해주세요.")
      return
    }
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential.identityToken) {
        Alert.alert("로그인 실패", "Apple 인증 토큰을 받을 수 없습니다.")
        return
      }

      const { token, user: u } = await api.loginWithApple(credential.identityToken, credential.fullName)
      await setStoredToken(token)
      setUser(u)
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: string }).code === "ERR_REQUEST_CANCELED"
      ) {
        return
      }
      Alert.alert("로그인 실패", err instanceof Error ? err.message : "Apple 로그인에 실패했습니다.")
    }
  }

  const signOut = async () => {
    await setStoredToken(null)
    setUser(null)
  }

  const deleteAccount = async () => {
    await api.deleteAccount()
    await setStoredToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAppleSignInAvailable,
        isAppleSignInChecked,
        signInWithGoogle,
        signInWithApple,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
