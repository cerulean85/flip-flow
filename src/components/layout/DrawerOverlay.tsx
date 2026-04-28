"use client"

import Sidebar from "./Sidebar"
import { cn } from "@/lib/utils"

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
  signOutAction: () => Promise<void>
  isOpen: boolean
  onClose: () => void
}

export default function DrawerOverlay({ user, signOutAction, isOpen, onClose }: Props) {
  return (
    <div className="md:hidden">
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!isOpen}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <Sidebar
          user={user}
          signOutAction={signOutAction}
          onNavigate={onClose}
          className="flex w-full"
        />
      </div>
    </div>
  )
}
