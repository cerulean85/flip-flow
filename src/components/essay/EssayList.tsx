import Link from "next/link"
import { NotebookPen } from "lucide-react"
import EssayCard from "./EssayCard"

interface Props {
  essays: { id: string; title: string; content: string; updatedAt: Date }[]
}

export default function EssayList({ essays }: Props) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">에세이</h1>
        <Link
          href="/essays/new"
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          + 새 에세이
        </Link>
      </div>

      {essays.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-zinc-500">
          <NotebookPen size={48} strokeWidth={1.5} className="mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm">아직 작성한 에세이가 없어요. 첫 글을 남겨보세요!</p>
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
