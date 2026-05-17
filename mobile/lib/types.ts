export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
}

export interface Card {
  id: string
  front: string
  back: string
  isBookmark: boolean
  order: number
  category: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Essay {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Sentence {
  ko: string
  en: string
}
