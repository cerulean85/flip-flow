"use client"

import { useState } from "react"
import EssayEditorModal from "./EssayEditorModal"
import { useLocale } from "@/components/LocaleProvider"

export default function NewEssayButton() {
  const { messages } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        {messages.essay.newEssay}
      </button>
      <EssayEditorModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
