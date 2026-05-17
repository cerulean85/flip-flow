"use client"

import type { Grade } from "@/lib/memory-srs"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  onGrade: (grade: Grade) => void
  disabled?: boolean
}

const GRADES: { grade: Grade; classes: string }[] = [
  {
    grade: "AGAIN",
    classes:
      "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900",
  },
  {
    grade: "HARD",
    classes:
      "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900",
  },
  {
    grade: "GOOD",
    classes:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900",
  },
  {
    grade: "EASY",
    classes:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
  },
]

export default function ReviewGradeButtons({ onGrade, disabled }: Props) {
  const { messages } = useLocale()
  const labels = messages.memory.review.grades

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {GRADES.map(({ grade, classes }) => (
        <button
          key={grade}
          type="button"
          onClick={() => onGrade(grade)}
          disabled={disabled}
          className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${classes}`}
        >
          {labels[grade]}
        </button>
      ))}
    </div>
  )
}
