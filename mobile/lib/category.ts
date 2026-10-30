import { CATEGORY_COLORS } from "./tokens.generated"

// Same category name always gets the same color, without storing colors in the DB
export function categoryColor(category: string | null | undefined): string {
  if (!category) return CATEGORY_COLORS[0]
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) | 0
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}
