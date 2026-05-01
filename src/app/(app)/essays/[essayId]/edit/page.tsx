import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EssayEditor from "@/components/essay/EssayEditor"

interface Props {
  params: Promise<{ essayId: string }>
}

export default async function EditEssayPage({ params }: Props) {
  const { essayId } = await params
  const session = await auth()

  const essay = await prisma.essay.findFirst({
    where: { id: essayId, userId: session!.user.id },
    select: { id: true, title: true, content: true },
  })

  if (!essay) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/essays/${essay.id}`}
          className="text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">에세이 수정</h1>
      </div>
      <EssayEditor
        essayId={essay.id}
        defaultValues={{ title: essay.title, content: essay.content }}
      />
    </div>
  )
}
