import type { Locale } from "@/i18n/routing"

function toDate(input: string | Date): Date {
  if (input instanceof Date) return input
  // Treat YYYY-MM-DD as a calendar date (no timezone shift).
  const [y, m, d] = input.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function formatLongDate(d: string | Date, locale: Locale = "zh-CN"): string {
  // Use dateStyle: 'long' so each locale gets its natural long-form:
  // zh-CN → "2026年5月30日", en-US → "May 30, 2026". Numeric components
  // alone produce slashes in zh-CN under some ICU builds.
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(toDate(d))
}

export function formatShortDate(d: string | Date, locale: Locale = "zh-CN"): string {
  return new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric" })
    .format(toDate(d))
}

export function formatWeekday(d: string | Date, locale: Locale = "zh-CN"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(toDate(d))
}
