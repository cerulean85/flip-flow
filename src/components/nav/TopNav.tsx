import Link from "next/link"
import { signOut } from "@/lib/auth"
import type { User } from "next-auth"
import Logo from "@/components/ui/Logo"
import SignOutButton from "./SignOutButton"

interface TopNavProps {
  user: User
}

export default function TopNav({ user }: TopNavProps) {
  const signOutAction = async () => {
    "use server"
    await signOut({ redirectTo: "/login" })
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard">
        <Logo size={28} showText={true} className="text-lg" />
      </Link>
      <SignOutButton
        signOutAction={signOutAction}
        image={user.image}
        name={user.name}
      />
    </header>
  )
}
