"use client"

import type { Card } from "@/generated/prisma/client"
import CardSlider from "./CardSlider"

interface Props {
  cards: Card[]
}

export default function StudyAll({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">🗂</p>
        <p className="text-sm">아직 카드가 없어요. 덱에서 카드를 추가해보세요!</p>
      </div>
    )
  }

  return <CardSlider cards={cards} />
}
