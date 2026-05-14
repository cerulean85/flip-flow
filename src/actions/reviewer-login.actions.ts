"use server"

import { signIn } from "@/lib/auth"

export async function signInAsReviewer() {
  if (process.env.REVIEWER_LOGIN_ENABLED !== "true") {
    throw new Error("Reviewer login is not enabled")
  }

  const email = process.env.REVIEWER_LOGIN_EMAIL
  const token = process.env.REVIEWER_LOGIN_TOKEN

  if (!email || !token) {
    throw new Error("Reviewer login is not configured")
  }

  await signIn("reviewer", {
    email,
    token,
    redirectTo: "/study",
  })
}
