import { timingSafeEqual } from "crypto"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { mobileUserPayload, signMobileToken } from "@/lib/mobile-auth"

function isExactSecretMatch(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)

  if (valueBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(valueBuffer, expectedBuffer)
}

export async function POST(request: NextRequest) {
  if (process.env.REVIEWER_LOGIN_ENABLED !== "true") {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const expectedEmail = process.env.REVIEWER_LOGIN_EMAIL?.trim().toLowerCase()
  const expectedToken = process.env.REVIEWER_LOGIN_TOKEN

  if (!expectedEmail || !expectedToken) {
    return Response.json({ error: "Reviewer login is not configured" }, { status: 503 })
  }

  try {
    const { email, token } = await request.json()
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
    const submittedToken = typeof token === "string" ? token : ""

    if (
      normalizedEmail !== expectedEmail ||
      !isExactSecretMatch(submittedToken, expectedToken)
    ) {
      return Response.json({ error: "Reviewer credentials are invalid" }, { status: 401 })
    }

    const user = await prisma.user.upsert({
      where: { email: expectedEmail },
      update: {
        name: "App Review",
      },
      create: {
        email: expectedEmail,
        name: "App Review",
      },
    })

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "reviewer",
          providerAccountId: expectedEmail,
        },
      },
      update: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        type: "credentials",
        provider: "reviewer",
        providerAccountId: expectedEmail,
      },
    })

    const mobileToken = await signMobileToken({
      userId: user.id,
      email: user.email!,
      name: user.name || "",
      image: user.image,
    })

    return Response.json({
      token: mobileToken,
      user: mobileUserPayload(user),
    })
  } catch (error) {
    console.error("Mobile reviewer auth error:", error)
    return Response.json({ error: "Reviewer login failed" }, { status: 500 })
  }
}
