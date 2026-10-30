import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Font sizes from design-tokens.json; without this, text-display etc. read as colors and get merged away
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "title", "card", "reading"] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
