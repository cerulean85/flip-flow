import { createRemoteJWKSet, jwtVerify } from "jose"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { mobileUserPayload, signMobileToken } from "@/lib/mobile-auth"

const appleKeys = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"))

function joinName(fullName: unknown) {
  if (!fullName || typeof fullName !== "object") return null
  const name = fullName as { givenName?: string; familyName?: string; nickname?: string }
  return [name.givenName, name.familyName].filter(Boolean).join(" ").trim() || name.nickname || null
}

export async function POST(request: NextRequest) {
  try {
    const { identityToken, fullName } = await request.json()
    if (!identityToken || typeof identityToken !== "string") {
      return Response.json({ error: "identityToken is required" }, { status: 400 })
    }

    const { payload } = await jwtVerify(identityToken, appleKeys, {
      issuer: "https://appleid.apple.com",
      audience: process.env.IOS_BUNDLE_IDENTIFIER ?? "com.dycdyp.flipflow",
    })

    const appleId = payload.sub
    if (!appleId || typeof appleId !== "string") {
      return Response.json({ error: "Invalid Apple token" }, { status: 401 })
    }

    const linkedAccount = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider: "apple", providerAccountId: appleId } },
      include: { user: true },
    })

    let user = linkedAccount?.user ?? null
    const email = typeof payload.email === "string" ? payload.email : null
    const name = joinName(fullName)

    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } })
    }

    if (!user) {
      if (!email) {
        return Response.json(
          { error: "Apple 계정의 이메일을 확인할 수 없습니다. Apple ID 설정에서 앱 접근을 해제한 뒤 다시 시도해주세요." },
          { status: 400 }
        )
      }
      user = await prisma.user.create({
        data: {
          email,
          name: name ?? email,
        },
      })
    }

    if (!linkedAccount) {
      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "apple",
          providerAccountId: appleId,
        },
      })
    }

    const token = await signMobileToken({
      userId: user.id,
      email: user.email!,
      name: user.name || "",
      image: user.image,
    })

    return Response.json({ token, user: mobileUserPayload(user) })
  } catch (error) {
    console.error("Mobile Apple auth error:", error)
    return Response.json({ error: "Apple 로그인에 실패했습니다." }, { status: 500 })
  }
}
