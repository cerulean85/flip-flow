import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type ThemeMode = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export interface ThemeColors {
  bg: string
  card: string
  cardAlt: string
  border: string
  text: string
  textMuted: string
  textSubtle: string
  primary: string
  primaryFg: string
  primarySoft: string
  primarySoftText: string
  accent: string
  danger: string
  dangerFg: string
  shadow: string
  star: string
}

const lightColors: ThemeColors = {
  bg: "#f9fafb",
  card: "#ffffff",
  cardAlt: "#f3f4f6",
  border: "#e5e7eb",
  text: "#111827",
  textMuted: "#4b5563",
  textSubtle: "#9ca3af",
  primary: "#3b82f6",
  primaryFg: "#ffffff",
  primarySoft: "#eff6ff",
  primarySoftText: "#2563eb",
  accent: "#1d4ed8",
  danger: "#ef4444",
  dangerFg: "#ffffff",
  shadow: "rgba(15, 23, 42, 0.08)",
  star: "#facc15",
}

const darkColors: ThemeColors = {
  bg: "#09090b",
  card: "#18181b",
  cardAlt: "#27272a",
  border: "#27272a",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  textSubtle: "#52525b",
  primary: "#3b82f6",
  primaryFg: "#ffffff",
  primarySoft: "#172554",
  primarySoftText: "#93c5fd",
  accent: "#1d4ed8",
  danger: "#f87171",
  dangerFg: "#ffffff",
  shadow: "rgba(0, 0, 0, 0.5)",
  star: "#facc15",
}

interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolved: ResolvedTheme
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  setMode: () => {},
  resolved: "light",
  colors: lightColors,
})

const STORAGE_KEY = "flipflow:theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme()
  const [mode, setModeState] = useState<ThemeMode>("system")

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setModeState(stored)
      }
    })
  }, [])

  const setMode = (next: ThemeMode) => {
    setModeState(next)
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {})
  }

  const resolved: ResolvedTheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode

  const colors = resolved === "dark" ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
