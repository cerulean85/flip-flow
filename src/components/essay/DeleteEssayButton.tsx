"use client"

import { useTransition } from "react"
import { deleteEssay } from "@/actions/essay.actions"

export default function DeleteEssayButton({ essayId }: { essayId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm("이 에세이를 삭제하시겠습니까?")) return
        startTransition(() => deleteEssay(essayId))
      }}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  )
}
