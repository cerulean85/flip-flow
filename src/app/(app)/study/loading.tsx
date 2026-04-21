import Skeleton from "@/components/ui/Skeleton"

export default function StudyAllLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-7 w-28 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="w-full h-64 rounded-2xl" />
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}
