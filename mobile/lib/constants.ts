import { CATEGORY_COLORS } from "./tokens.generated"

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim()

export const API_URL = (configuredApiUrl || "http://localhost:3000").replace(/\/$/, "")

export const POLICY_URL = `${API_URL}/privacy`
export const TERMS_URL = `${API_URL}/terms`
export const SUPPORT_URL = `${API_URL}/support`

export const DECK_COLORS = CATEGORY_COLORS
