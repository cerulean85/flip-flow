import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { messages } from "@/lib/messages"
import { getRequestLocale } from "@/lib/i18n"
import { headers } from "next/headers"
import MemoryForm from "@/components/memory/MemoryForm"

export default async function EditMemoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  const locale = getRequestLocale(await headers())
  const t = messages[locale]

  const item = await prisma.memoryItem.findFirst({
    where: { id, userId: session!.user.id },
    select: {
      id: true,
      title: true,
      type: true,
      meaning: true,
      explanation: true,
      example: true,
      contextText: true,
    },
  })

  if (!item) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-gray-800 dark:text-zinc-100">
        {t.memory.editItem}
      </h1>
      <MemoryForm itemId={item.id} defaultValues={item} />
    </div>
  )
}
