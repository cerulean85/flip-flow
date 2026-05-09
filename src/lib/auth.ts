import { timingSafeEqual } from "crypto"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { SignJWT, importPKCS8 } from "jose"
import { prisma } from "@/lib/prisma"

function isExactSecretMatch(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)

  if (valueBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(valueBuffer, expectedBuffer)
}

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

const reviewerProvider =
  process.env.REVIEWER_LOGIN_ENABLED === "true"
    ? Credentials({
        id: "reviewer",
        name: "Reviewer",
        credentials: {
          email: { label: "Email", type: "email" },
          token: { label: "Token", type: "password" },
        },
        async authorize(credentials) {
          const expectedEmail = process.env.REVIEWER_LOGIN_EMAIL?.trim().toLowerCase()
          const expectedToken = process.env.REVIEWER_LOGIN_TOKEN
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : ""
          const token = typeof credentials?.token === "string" ? credentials.token : ""

          if (
            !expectedEmail ||
            !expectedToken ||
            email !== expectedEmail ||
            !isExactSecretMatch(token, expectedToken)
          ) {
            return null
          }

          const user = await prisma.user.upsert({
            where: { email: expectedEmail },
            update: { name: "App Review" },
            create: { email: expectedEmail, name: "App Review" },
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

          return user
        },
      })
    : null

const providers: Provider[] = [Google]

if (appleProvider) {
  providers.push(appleProvider)
}

if (reviewerProvider) {
  providers.push(reviewerProvider)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
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
