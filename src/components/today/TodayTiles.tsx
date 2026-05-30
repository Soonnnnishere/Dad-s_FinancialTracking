import { useTranslations } from "next-intl"
import type { Locale } from "@/i18n/routing"
import { formatCurrency } from "@/lib/formatters/currency"

export function TodayTiles({
  todaySpent,
  todayEarned,
  monthNet,
  locale,
  currency,
}: {
  todaySpent: number
  todayEarned: number
  monthNet: number
  locale: Locale
  currency: string
}) {
  const t = useTranslations("today.tiles")
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: t("spent"),    value: todaySpent,  color: "text-expense" },
        { label: t("earned"),   value: todayEarned, color: "text-income" },
        { label: t("netMonth"), value: monthNet,    color: "text-fg" },
      ].map((tile) => (
        <div key={tile.label} className="border border-border rounded-lg px-3 py-4">
          <p className="text-xs text-muted-foreground">{tile.label}</p>
          <p className={`mt-1 text-xl md:text-2xl font-mono ${tile.color}`}>
            {formatCurrency(tile.value, currency, locale)}
          </p>
        </div>
      ))}
    </div>
  )
}
