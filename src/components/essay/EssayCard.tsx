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
      className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="truncate text-base font-semibold text-gray-900 dark:text-zinc-100">
        {essay.title}
      </h3>
      {essay.content.trim() && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-zinc-400">
          {previewText(essay.content)}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
        {formatLocalizedDate(essay.updatedAt, locale)}
      </p>
    </Link>
  )
}
