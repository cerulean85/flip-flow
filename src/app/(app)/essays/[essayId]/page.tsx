import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EssayContent from "@/components/essay/EssayContent"
import DeleteEssayButton from "@/components/essay/DeleteEssayButton"
import EditEssayButton from "@/components/essay/EditEssayButton"

interface Props {
  params: Promise<{ essayId: string }>
}

function formatDate(d: Date) {
  return d.toLocaleDateString("ko", { year: "numeric", month: "long", day: "numeric" })
}

export default async function EssayDetailPage({ params }: Props) {
  const { essayId } = await params
  const session = await auth()

  const essay = await prisma.essay.findFirst({
    where: { id: essayId, userId: session!.user.id },
  })

  if (!essay) notFound()

  return (
    <article>
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/essays"
          className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ←
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-zinc-100">
            {essay.title}
          </h1>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">
            {formatDate(essay.updatedAt)}
          </p>
        </div>
        <EditEssayButton
          essayId={essay.id}
          title={essay.title}
          content={essay.content}
        />
        <DeleteEssayButton essayId={essay.id} />
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <EssayContent markdown={essay.content} />
      </div>
    </article>
  )
}
