import Skeleton from "@/components/ui/Skeleton"

export default function SpeakingLoading() {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  )
}
