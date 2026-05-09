import type { Metadata } from "next"
import { headers } from "next/headers"
import { getRequestLocale } from "@/lib/i18n"
import { legalContent } from "@/lib/legal"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return legalContent[locale].layout
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
