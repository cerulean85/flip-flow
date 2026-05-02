const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim()

export const API_URL = (configuredApiUrl || "http://localhost:3000").replace(/\/$/, "")

export const POLICY_URL = `${API_URL}/privacy`
export const TERMS_URL = `${API_URL}/terms`
export const SUPPORT_URL = `${API_URL}/support`

export const DECK_COLORS = [
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#8b5cf6",
] as const
