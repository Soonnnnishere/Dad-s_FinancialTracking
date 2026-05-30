import type { Locale } from "@/i18n/routing"
import type { Transaction } from "@/lib/queries/transactions"
import { TransactionRow, type RowTx } from "./TransactionRow"

export function TransactionList({
  txs,
  locale,
  currency,
  onEdit,
}: {
  txs: RowTx[]
  locale: Locale
  currency: string
  onEdit: (tx: Transaction) => void
}) {
  return (
    <div className="divide-y divide-border">
      {txs.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          locale={locale}
          currency={currency}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
