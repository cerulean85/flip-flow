export interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  createdAt: string
  updatedAt: string
  userId: string
  _count?: { cards: number }
}

export interface Card {
  id: string
  front: string
  back: string
  isBookmark: boolean
  order: number
  deckId: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  image: string | null
}
