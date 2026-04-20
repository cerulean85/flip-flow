import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import TopNav from "@/components/nav/TopNav"
import BottomNav from "@/components/nav/BottomNav"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <TopNav user={session.user} />
      <main className="flex-1 pb-20 px-4 pt-4">{children}</main>
      <BottomNav />
    </div>
  )
}
