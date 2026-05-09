import { cn } from "@/lib/utils"

type AdPlacement = "sidebar" | "content" | "study"

interface AdSlotProps {
  placement: AdPlacement
  className?: string
}

const placementClasses: Record<AdPlacement, string> = {
  sidebar: "h-40 w-full",
  content: "min-h-24 w-full sm:min-h-28",
  study: "min-h-20 w-full",
}

const placementLabels: Record<AdPlacement, string> = {
  sidebar: "스폰서",
  content: "광고",
  study: "광고",
}

export default function AdSlot({ placement, className }: AdSlotProps) {
  return (
    <aside
      aria-label={placementLabels[placement]}
      data-ad-placement={placement}
      className={cn(
        "overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70",
        placementClasses[placement],
        className
      )}
    >
      <div className="flex h-full flex-col items-center justify-center gap-1 px-4 py-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-zinc-600">
          {placementLabels[placement]}
        </p>
        <div className="h-2 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" aria-hidden="true" />
        <div className="h-2 w-24 rounded-full bg-gray-100 dark:bg-zinc-800" aria-hidden="true" />
      </div>
    </aside>
  )
}
