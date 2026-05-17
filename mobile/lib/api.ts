import * as SecureStore from "expo-secure-store"
import { API_URL } from "./constants"
import type { Card, Essay, Sentence, User } from "./types"

const TOKEN_KEY = "flipflow_token"

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  } catch {
    return null
  }
}

export async function setStoredToken(token: string | null) {
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (auth) {
    const token = await getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    let message = `요청에 실패했습니다. (${res.status})`
    try {
      const parsed = JSON.parse(text)
      if (parsed?.error) message = parsed.error
    } catch {
      const contentType = res.headers.get("content-type") ?? ""
      if (contentType.includes("text/html") || text.trimStart().startsWith("<!DOCTYPE")) {
        message = `서버 API를 찾을 수 없습니다. (${res.status})\n${API_URL}${path}`
      } else if (text) {
        message = text.slice(0, 300)
      }
    }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  // ---- Auth ----
  loginWithGoogle: (idToken: string) =>
    request<{ token: string; user: User }>("/api/mobile/auth/google", {
      method: "POST",
      body: { idToken },
      auth: false,
    }),
  loginWithApple: (identityToken: string, fullName?: unknown) =>
    request<{ token: string; user: User }>("/api/mobile/auth/apple", {
      method: "POST",
      body: { identityToken, fullName },
      auth: false,
    }),
  loginAsReviewer: (email: string, token: string) =>
    request<{ token: string; user: User }>("/api/mobile/auth/reviewer", {
      method: "POST",
      body: { email, token },
      auth: false,
    }),
  deleteAccount: () =>
    request<{ ok: true }>("/api/mobile/account", {
      method: "DELETE",
    }),

  // ---- Cards ----
  listAllCards: async () => {
    const cards = await request<Card[]>("/api/mobile/cards/all")
    return { cards }
  },
  listBookmarks: async () => {
    const cards = await request<Card[]>("/api/mobile/cards/bookmarks")
    return { cards }
  },
  createCard: async (data: { front: string; back: string; category?: string | null }) => {
    const card = await request<Card>("/api/mobile/cards", { method: "POST", body: data })
    return { card }
  },
  updateCard: async (
    id: string,
    data: { front?: string; back?: string; category?: string | null }
  ) => {
    const card = await request<Card>(`/api/mobile/cards/${id}`, { method: "PUT", body: data })
    return { card }
  },
  deleteCard: async (id: string) => {
    await request<unknown>(`/api/mobile/cards/${id}`, { method: "DELETE" })
    return { ok: true as const }
  },
  toggleBookmark: async (id: string) => {
    const card = await request<Card>(`/api/mobile/cards/${id}/bookmark`, { method: "POST" })
    return { card }
  },

  // ---- AI ----
  searchDefinition: (word: string) =>
    request<{ result: string }>("/api/mobile/ai/definition", {
      method: "POST",
      body: { word },
    }),
  generateSentences: (front: string, back: string) =>
    request<{ sentences: Sentence[] }>("/api/mobile/sentences", {
      method: "POST",
      body: { front, back },
    }),

  // ---- Essays ----
  listEssays: () => request<{ essays: Essay[] }>("/api/mobile/essays"),
  getEssay: (id: string) => request<{ essay: Essay }>(`/api/mobile/essays/${id}`),
  createEssay: (data: { title: string; content: string }) =>
    request<{ essay: Essay }>("/api/mobile/essays", { method: "POST", body: data }),
  updateEssay: (id: string, data: { title: string; content: string }) =>
    request<{ essay: Essay }>(`/api/mobile/essays/${id}`, { method: "PATCH", body: data }),
  deleteEssay: (id: string) =>
    request<{ ok: true }>(`/api/mobile/essays/${id}`, { method: "DELETE" }),
}
