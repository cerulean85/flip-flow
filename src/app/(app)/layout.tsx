import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"
import AppShell from "@/components/layout/AppShell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const signOutAction = async () => {
    "use server"
    await signOut({ redirectTo: "/login" })
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }

  return (
    <AppShell user={user} signOutAction={signOutAction}>
      {children}
    </AppShell>
  )
}
