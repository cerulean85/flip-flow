"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import DrawerOverlay from "./DrawerOverlay"
import TopBar from "./TopBar"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Props {
  user: User
  signOutAction: () => Promise<void>
  children: ReactNode
}

export default function AppShell({ user, signOutAction, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // close drawer on route change (back/forward, programmatic navigation)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        user={user}
        signOutAction={signOutAction}
        className="hidden md:flex"
      />
      <DrawerOverlay
        user={user}
        signOutAction={signOutAction}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onToggle={() => setIsOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
