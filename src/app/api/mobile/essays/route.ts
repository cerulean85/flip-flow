import { NextRequest } from "next/server"
import { verifyMobileToken } from "@/lib/mobile-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const essays = await prisma.essay.findMany({
      where: { userId },
      select: { id: true, title: true, content: true, updatedAt: true, createdAt: true },
      orderBy: { updatedAt: "desc" },
    })
    return Response.json({ essays })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { title, content } = await request.json()
    const trimmedTitle = (title as string)?.trim()
    if (!trimmedTitle) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }
    const essay = await prisma.essay.create({
      data: {
        title: trimmedTitle,
        content: ((content as string) ?? "").trim(),
        userId,
      },
    })
    return Response.json({ essay })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
