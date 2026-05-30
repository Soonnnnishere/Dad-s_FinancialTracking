"use client"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { CalendarDays, History, BarChart3, Wallet, Settings } from "lucide-react"

const items = [
  { href: "/today", icon: CalendarDays, key: "today" },
  { href: "/history", icon: History, key: "history" },
  { href: "/reports", icon: BarChart3, key: "reports" },
  { href: "/budgets", icon: Wallet, key: "budgets" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const

export function Sidebar() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex w-56 shrink-0 border-r border-border flex-col py-6 px-3 gap-1">
      {items.map(({ href, icon: Icon, key }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 h-12 rounded-md text-base
              ${active ? "bg-surface text-fg" : "text-muted-foreground hover:text-fg"}`}
          >
            <Icon className="size-5" />
            {t(key)}
          </Link>
        )
      })}
    </aside>
  )
}
