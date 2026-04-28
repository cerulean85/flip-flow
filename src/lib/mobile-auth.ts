import { SignJWT, jwtVerify } from "jose"
import { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

export async function signMobileToken(payload: {
  userId: string
  email: string
  name: string
  image: string | null
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret)
}

export async function verifyMobileToken(request: NextRequest) {
  const header = request.headers.get("Authorization")
  if (!header?.startsWith("Bearer ")) {
    throw new Error("Unauthorized")
  }

  const token = header.slice(7)
  const { payload } = await jwtVerify(token, secret)

  if (!payload.userId || typeof payload.userId !== "string") {
    throw new Error("Invalid token")
  }

  return { userId: payload.userId as string }
}
