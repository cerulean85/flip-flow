import Skeleton from "@/components/ui/Skeleton"

export default function BookmarksLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-32 mb-4" />

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>

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
