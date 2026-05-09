import { NotebookPen } from "lucide-react"
import EssayCard from "./EssayCard"
import NewEssayButton from "./NewEssayButton"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"

interface Props {
  essays: { id: string; title: string; content: string; updatedAt: Date }[]
}

export default async function EssayList({ essays }: Props) {
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">{t.essay.title}</h1>
        <NewEssayButton />
      </div>

      {essays.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <NotebookPen size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">{t.essay.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {essays.map((essay) => (
            <EssayCard key={essay.id} essay={essay} />
          ))}
        </div>
      )}
    </div>
  )
}
