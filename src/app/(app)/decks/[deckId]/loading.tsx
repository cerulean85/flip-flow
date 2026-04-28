import Skeleton from "@/components/ui/Skeleton"

export default function DeckDetailLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm dark:bg-gray-900 dark:border dark:border-gray-800">
            <Skeleton className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-5 w-5 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
