import { getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { listCategoriesServer } from "@/lib/queries/categories-server"
import {
  listTodayServer,
  getTodayTotalsServer,
  getMonthTotalsServer,
  getLastTransactionServer,
  topCategoriesServer,
} from "@/lib/queries/transactions-server"
import type { Category } from "@/lib/queries/categories"
import { TodayTiles } from "@/components/today/TodayTiles"
import type { RowTx } from "@/components/transactions/TransactionRow"
import { TodayClient } from "./TodayClient"

export default async function TodayPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("today")

  const supabase = await createClient()
  const { data: prefs } = await supabase
    .from("preferences")
    .select("currency")
    .single()
  const currency = prefs?.currency ?? "MYR"

  const [categories, todayRows, todayTot, monthTot, last, top] = await Promise.all([
    listCategoriesServer(),
    listTodayServer(),
    getTodayTotalsServer(),
    getMonthTotalsServer(),
    getLastTransactionServer(),
    topCategoriesServer(4),
  ])

  // preselect: most-used category overall, fall back to first expense category
  const preselectId =
    top[0]?.id ?? categories.find((c) => c.kind === "expense")?.id ?? null

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{t("title")}</h1>
      </div>

      <TodayTiles
        todaySpent={todayTot.expense}
        todayEarned={todayTot.income}
        monthNet={monthTot.net}
        locale={locale as Locale}
        currency={currency}
      />

      {todayRows.length === 0 && (
        <p className="text-muted-foreground py-6">{t("empty")}</p>
      )}

      <TodayClient
        categories={categories as Category[]}
        preselectId={preselectId}
        lastTx={last}
        todayRows={todayRows as RowTx[]}
        locale={locale as Locale}
        currency={currency}
      />
    </div>
  )
}
