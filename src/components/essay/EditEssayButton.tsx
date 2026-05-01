"use client"

import { useState } from "react"
import EssayEditorModal from "./EssayEditorModal"

interface Props {
  essayId: string
  title: string
  content: string
}

export default function EditEssayButton({ essayId, title, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        수정
      </button>
      <EssayEditorModal
        open={open}
        onClose={() => setOpen(false)}
        essayId={essayId}
        defaultValues={{ title, content }}
      />
    </>
  )
}
