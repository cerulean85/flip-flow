import { NextRequest } from "next/server"
import { verifyMobileToken } from "@/lib/mobile-auth"
import { prisma } from "@/lib/prisma"

interface Ctx {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await ctx.params
    const essay = await prisma.essay.findFirst({ where: { id, userId } })
    if (!essay) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ essay })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await ctx.params
    const { title, content } = await request.json()
    const trimmedTitle = (title as string)?.trim()
    if (!trimmedTitle) {
      return Response.json({ error: "Title is required" }, { status: 400 })
    }
    const result = await prisma.essay.updateMany({
      where: { id, userId },
      data: { title: trimmedTitle, content: ((content as string) ?? "").trim() },
    })
    if (result.count === 0) return Response.json({ error: "Not found" }, { status: 404 })
    const essay = await prisma.essay.findFirst({ where: { id, userId } })
    return Response.json({ essay })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  try {
    const { userId } = await verifyMobileToken(request)
    const { id } = await ctx.params
    await prisma.essay.deleteMany({ where: { id, userId } })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
