import Link from "next/link"
import DeckForm from "@/components/deck/DeckForm"

export default function NewDeckPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">←</Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">새 덱 만들기</h1>
      </div>
      <DeckForm />
    </div>
  )
}
