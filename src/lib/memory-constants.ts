import type { MemoryItemType } from "@/generated/prisma/enums"
import type { Grade } from "@/lib/memory-srs"

export const MEMORY_ITEM_TYPES = [
  "WORD",
  "PHRASE",
  "SENTENCE",
  "GRAMMAR_PATTERN",
] as const satisfies readonly MemoryItemType[]

export const VALID_MEMORY_ITEM_TYPES: ReadonlySet<MemoryItemType> = new Set(MEMORY_ITEM_TYPES)

export const MEMORY_REVIEW_GRADES = ["AGAIN", "HARD", "GOOD", "EASY"] as const satisfies readonly Grade[]

export const VALID_REVIEW_GRADES: ReadonlySet<Grade> = new Set(MEMORY_REVIEW_GRADES)

export const MEMORY_TITLE_MAX = 500
export const MEMORY_LONG_TEXT_MAX = 4000
