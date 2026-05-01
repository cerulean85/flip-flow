"use client"

import { Layers } from "lucide-react"
import type { Card } from "@/generated/prisma/client"
import CardSlider from "./CardSlider"

interface Props {
  cards: Card[]
}

export default function StudyAll({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-zinc-500">
        <Layers size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm">아직 카드가 없어요. 덱에서 카드를 추가해보세요!</p>
      </div>
    )
  }

  return <CardSlider cards={cards} controlsPosition="top" />
}
