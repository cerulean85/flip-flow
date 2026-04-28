import * as SecureStore from "expo-secure-store"
import { API_URL } from "./constants"
import type { Deck, Card } from "./types"

let onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await SecureStore.getItemAsync("auth_token")

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    onUnauthorized?.()
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Request failed")
  }

  return res.json()
}

// Decks
export const getDecks = () => request<Deck[]>("/api/mobile/decks")

export const getDeck = (id: string) => request<Deck>(`/api/mobile/decks/${id}`)

export const createDeck = (data: { title: string; description?: string; color?: string }) =>
  request<Deck>("/api/mobile/decks", { method: "POST", body: JSON.stringify(data) })

export const updateDeck = (id: string, data: { title?: string; description?: string; color?: string }) =>
  request<Deck>(`/api/mobile/decks/${id}`, { method: "PUT", body: JSON.stringify(data) })

export const deleteDeck = (id: string) =>
  request<{ success: boolean }>(`/api/mobile/decks/${id}`, { method: "DELETE" })

// Cards
export const getDeckCards = (deckId: string) =>
  request<Card[]>(`/api/mobile/decks/${deckId}/cards`)

export const createCard = (deckId: string, data: { front: string; back: string }) =>
  request<Card>(`/api/mobile/decks/${deckId}/cards`, { method: "POST", body: JSON.stringify(data) })

export const updateCard = (id: string, data: { front?: string; back?: string }) =>
  request<Card>(`/api/mobile/cards/${id}`, { method: "PUT", body: JSON.stringify(data) })

export const deleteCard = (id: string) =>
  request<{ success: boolean }>(`/api/mobile/cards/${id}`, { method: "DELETE" })

export const toggleBookmark = (id: string) =>
  request<Card>(`/api/mobile/cards/${id}/bookmark`, { method: "POST" })

export const moveCard = (id: string, toDeckId: string) =>
  request<Card>(`/api/mobile/cards/${id}/move`, { method: "POST", body: JSON.stringify({ toDeckId }) })

export const getAllCards = () => request<Card[]>("/api/mobile/cards/all")

export const getBookmarkedCards = () => request<Card[]>("/api/mobile/cards/bookmarks")

// AI
export const searchDefinition = (word: string) =>
  request<{ result: string }>("/api/mobile/ai/definition", { method: "POST", body: JSON.stringify({ word }) })
