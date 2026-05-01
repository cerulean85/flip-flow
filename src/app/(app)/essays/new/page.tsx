import Link from "next/link"
import EssayEditor from "@/components/essay/EssayEditor"

export default function NewEssayPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/essays"
          className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">새 에세이</h1>
      </div>
      <EssayEditor />
    </div>
  )
}
