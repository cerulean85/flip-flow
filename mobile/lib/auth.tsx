import React, { createContext, useContext, useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { API_URL } from "./constants"
import { setOnUnauthorized } from "./api"
import type { AuthUser } from "./types"

WebBrowser.maybeCompleteAuthSession()

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  })

  // Handle unauthorized responses
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null)
      SecureStore.deleteItemAsync("auth_token")
      SecureStore.deleteItemAsync("auth_user")
    })
  }, [])

  // Restore session on mount
  useEffect(() => {
    ;(async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token")
        const userJson = await SecureStore.getItemAsync("auth_user")
        if (token && userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params
      exchangeToken(id_token)
    }
  }, [response])

  async function exchangeToken(idToken: string) {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/api/mobile/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) throw new Error("Auth failed")

      const data = await res.json()
      await SecureStore.setItemAsync("auth_token", data.token)
      await SecureStore.setItemAsync("auth_user", JSON.stringify(data.user))
      setUser(data.user)
    } catch (error) {
      console.error("Token exchange failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function signIn() {
    await promptAsync()
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("auth_token")
    await SecureStore.deleteItemAsync("auth_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
