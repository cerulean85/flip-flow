import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { signMobileToken } from "@/lib/mobile-auth"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return Response.json({ error: "idToken is required" }, { status: 400 })
    }

    // Verify Google ID token
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    )
    if (!googleRes.ok) {
      return Response.json({ error: "Invalid Google token" }, { status: 401 })
    }

    const googleUser = await googleRes.json()
    const { email, name, picture: image, sub: googleId } = googleUser

    if (!email) {
      return Response.json({ error: "Email not found in token" }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || email, image },
      })
      // Link Google account
      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: googleId,
        },
      })
    }

    // Issue JWT
    const token = await signMobileToken({
      userId: user.id,
      email: user.email!,
      name: user.name || "",
      image: user.image,
    })

    return Response.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
    })
  } catch (error) {
    console.error("Mobile auth error:", error)
    return Response.json({ error: "Authentication failed" }, { status: 500 })
  }
}
