"use client"
import { Plus } from "lucide-react"

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="add"
      className="fixed bottom-20 md:bottom-6 right-4 size-16 rounded-full
                 bg-income text-white shadow-md flex items-center justify-center
                 hover:opacity-90 active:scale-95 transition z-30"
    >
      <Plus className="size-7" />
    </button>
  )
}
