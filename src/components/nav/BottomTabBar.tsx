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

export function BottomTabBar() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 h-16 border-t border-border bg-bg
                 grid grid-cols-5 z-40"
    >
      {items.map(({ href, icon: Icon, key }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 text-xs
              ${active ? "text-fg" : "text-muted-foreground"}`}
          >
            <Icon className="size-5" />
            {t(key)}
          </Link>
        )
      })}
    </nav>
  )
}
