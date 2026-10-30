import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { darkColors as tokenDarkColors, lightColors as tokenLightColors } from "./tokens.generated"

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

const lightColors: ThemeColors = tokenLightColors
const darkColors: ThemeColors = tokenDarkColors

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
