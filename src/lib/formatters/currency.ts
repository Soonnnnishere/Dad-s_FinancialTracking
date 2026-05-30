import type { Locale } from "@/i18n/routing"

export function formatCurrency(
  amount: number,
  currency = "MYR",
  locale: Locale = "zh-CN",
): string {
  // Intl renders MYR as "MYR 1,234.50" in some locales; force "RM " prefix to
  // match dad's expectation. We still use Intl for grouping/decimal symbols.
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return currency === "MYR" ? `RM ${number}` : `${currency} ${number}`
}
