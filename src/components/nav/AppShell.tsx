import { Sidebar } from "./Sidebar"
import { BottomTabBar } from "./BottomTabBar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 max-w-[640px] mx-auto w-full px-4 md:px-6 py-6">
        {children}
      </main>
      <BottomTabBar />
    </div>
  )
}
