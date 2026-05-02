import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { SignJWT, importPKCS8 } from "jose"
import { prisma } from "@/lib/prisma"

async function generateAppleClientSecret(): Promise<string> {
  const teamId = process.env.AUTH_APPLE_TEAM_ID
  const keyId = process.env.AUTH_APPLE_KEY_ID
  const clientId = process.env.AUTH_APPLE_ID
  const privateKeyRaw = process.env.AUTH_APPLE_PRIVATE_KEY

  if (!teamId || !keyId || !clientId || !privateKeyRaw) {
    throw new Error(
      "Apple sign-in env vars missing (AUTH_APPLE_TEAM_ID, AUTH_APPLE_KEY_ID, AUTH_APPLE_ID, AUTH_APPLE_PRIVATE_KEY)"
    )
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n")
  const key = await importPKCS8(privateKey, "ES256")

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setAudience("https://appleid.apple.com")
    .setSubject(clientId)
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(key)
}

const appleEnabled = Boolean(
  process.env.AUTH_APPLE_ID &&
    process.env.AUTH_APPLE_TEAM_ID &&
    process.env.AUTH_APPLE_KEY_ID &&
    process.env.AUTH_APPLE_PRIVATE_KEY
)

const appleProvider = appleEnabled
  ? Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: await generateAppleClientSecret(),
    })
  : null

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: appleProvider ? [Google, appleProvider] : [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
