"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { createEssay, updateEssay } from "@/actions/essay.actions"
import EssayContent from "./EssayContent"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  essayId?: string
  defaultValues?: { title: string; content: string }
  onCancel?: () => void
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

export default function EssayEditor({ essayId, defaultValues, onCancel }: Props) {
  const { messages } = useLocale()
  const [content, setContent] = useState(defaultValues?.content ?? "")
  const [mobileMode, setMobileMode] = useState<"edit" | "preview">("edit")
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false)

  const action = essayId
    ? updateEssay.bind(null, essayId)
    : createEssay

  const cancelHref = essayId ? `/essays/${essayId}` : "/essays"

  const cancelClassName =
    "rounded-xl border border-border-strong px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted"

  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        name="title"
        required
        defaultValue={defaultValues?.title}
        placeholder={messages.essay.titlePlaceholder}
        className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-blue-400 dark:placeholder:text-zinc-500"
      />

      {/* Mobile tab switcher */}
      <div className="flex gap-1 rounded-xl border border-border p-1 md:hidden">
        {(["edit", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMobileMode(m)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              mobileMode === m
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-surface-muted"
            )}
          >
            {m === "edit" ? messages.essay.edit : messages.essay.preview}
          </button>
        ))}
      </div>

      <div className="hidden items-center justify-end md:flex">
        <button
          type="button"
          onClick={() => setIsPreviewCollapsed((value) => !value)}
          aria-label={
            isPreviewCollapsed
              ? messages.essay.showPreview
              : messages.essay.hidePreview
          }
          title={
            isPreviewCollapsed
              ? messages.essay.showPreview
              : messages.essay.hidePreview
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-text-muted transition-colors hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {isPreviewCollapsed ? (
            <PanelRightOpen size={18} aria-hidden="true" />
          ) : (
            <PanelRightClose size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Editor + Preview */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          isPreviewCollapsed ? "md:grid-cols-1" : "md:grid-cols-2"
        )}
      >
        <div className={cn("md:block", mobileMode === "edit" ? "block" : "hidden")}>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={messages.essay.contentPlaceholder}
            rows={20}
            className="h-[65vh] w-full resize-none rounded-xl border border-border-strong bg-surface p-4 font-mono text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-blue-400 dark:placeholder:text-zinc-500"
          />
        </div>

        <div
          className={cn(
            "md:block",
            mobileMode === "preview" ? "block" : "hidden",
            isPreviewCollapsed && "md:hidden"
          )}
        >
          <div className="h-[65vh] overflow-y-auto rounded-xl border border-border bg-surface p-4">
            <EssayContent markdown={content} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button type="button" onClick={onCancel} className={cancelClassName}>
            {messages.essay.cancel}
          </button>
        ) : (
          <Link href={cancelHref} className={cancelClassName}>
            {messages.essay.cancel}
          </Link>
        )}
        <SubmitButton
          label={essayId ? messages.essay.save : messages.essay.publish}
          pendingLabel={messages.essay.saving}
        />
      </div>
    </form>
  )
}
