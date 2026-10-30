import Link from "next/link"
import { formatLocalizedDate } from "@/lib/date"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"

interface Props {
  essay: { id: string; title: string; content: string; updatedAt: Date }
}

function previewText(markdown: string, len = 120) {
  const trimmed = markdown.replace(/[#*`>\-_~[\]()]/g, " ").replace(/\s+/g, " ").trim()
  if (trimmed.length <= len) return trimmed
  return trimmed.slice(0, len) + "…"
}

export default async function EssayCard({ essay }: Props) {
  const locale = getRequestLocale(await headers())

  return (
    <Link
      href={`/essays/${essay.id}`}
      className="block rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="truncate text-base font-semibold text-text">
        {essay.title}
      </h3>
      {essay.content.trim() && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-zinc-400">
          {previewText(essay.content)}
        </p>
      )}
      <p className="mt-3 text-xs text-text-subtle">
        {formatLocalizedDate(essay.updatedAt, locale)}
      </p>
    </Link>
  )
}
