"use client"

import { useTransition } from "react"
import { deleteEssay } from "@/actions/essay.actions"
import { useLocale } from "@/components/LocaleProvider"

export default function DeleteEssayButton({ essayId }: { essayId: string }) {
  const { messages } = useLocale()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm(messages.essay.deleteConfirm)) return
        startTransition(() => deleteEssay(essayId))
      }}
      disabled={isPending}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? messages.essay.deleting : messages.essay.delete}
    </button>
  )
}
