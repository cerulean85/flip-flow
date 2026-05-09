"use client"

import { Layers } from "lucide-react"
import type { Card } from "@/generated/prisma/client"
import CardSlider from "./CardSlider"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  cards: Card[]
}

export default function StudyAll({ cards }: Props) {
  const { messages } = useLocale()

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-zinc-500">
        <Layers size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm">{messages.card.empty}</p>
      </div>
    )
  }

  return <CardSlider cards={cards} controlsPosition="top" />
}
