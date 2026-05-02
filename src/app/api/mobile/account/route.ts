import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyMobileToken } from "@/lib/mobile-auth"

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await verifyMobileToken(request)
    await prisma.user.delete({ where: { id: userId } })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}
