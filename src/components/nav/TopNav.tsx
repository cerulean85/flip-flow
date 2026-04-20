import Link from "next/link"
import { signOut } from "@/lib/auth"
import type { User } from "next-auth"
import Logo from "@/components/ui/Logo"

interface TopNavProps {
  user: User
}

export default function TopNav({ user }: TopNavProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard">
        <Logo size={28} showText={true} className="text-lg" />
      </Link>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
        >
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? "user"} className="w-7 h-7 rounded-full" />
          )}
          <span className="hidden sm:inline">{user.name}</span>
        </button>
      </form>
    </header>
  )
}
