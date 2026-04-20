import Link from "next/link"
import DeckForm from "@/components/deck/DeckForm"

export default function NewDeckPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700">←</Link>
        <h1 className="text-xl font-bold text-gray-800">새 덱 만들기</h1>
      </div>
      <DeckForm />
    </div>
  )
}
