import Skeleton from "@/components/ui/Skeleton"

export default function StudyLoading() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-5 w-4" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Card skeleton */}
        <Skeleton className="w-full h-64 rounded-2xl" />

        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-14" />
        </div>

        <Skeleton className="h-1 w-full rounded-full" />
      </div>
    </div>
  )
}
