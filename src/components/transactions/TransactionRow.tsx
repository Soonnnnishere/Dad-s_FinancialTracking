"use client"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { formatCurrency } from "@/lib/formatters/currency"
import { useCategoryLabel, type Category } from "@/lib/queries/categories"
import {
  createTransaction,
  deleteTransaction,
  type Transaction,
} from "@/lib/queries/transactions"

export type RowTx = Transaction & { category: Category | null }

export function TransactionRow({
  tx,
  locale,
  currency,
  onEdit,
}: {
  tx: RowTx
  locale: Locale
  currency: string
  onEdit: (tx: Transaction) => void
}) {
  const label = useCategoryLabel()
  const tt = useTranslations("toast")
  const router = useRouter()

  async function handleDelete() {
    const snapshot = { ...tx }
    try {
      await deleteTransaction(tx.id)
      router.refresh()
      toast(tt("deleted"), {
        action: {
          label: tt("undo"),
          onClick: async () => {
            await createTransaction({
              amount: Number(snapshot.amount),
              category_id: snapshot.category_id,
              kind: snapshot.kind,
              occurred_on: snapshot.occurred_on,
              note: snapshot.note,
              currency: snapshot.currency,
            })
            router.refresh()
          },
        },
        duration: 5000,
      })
    } catch {
      toast.error(tt("failed"))
    }
  }

  const amountColor = tx.kind === "income" ? "text-income" : "text-expense"
  const sign = tx.kind === "income" ? "+" : "−"

  return (
    <div className="flex items-center justify-between py-3">
      <button
        onClick={() => onEdit(tx)}
        className="flex items-center gap-3 min-w-0 text-left flex-1"
      >
        <span
          className="size-3 rounded-full shrink-0"
          style={{ background: tx.category?.color ?? "#999" }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm">{tx.category ? label(tx.category) : "—"}</p>
          {tx.note && <p className="text-xs text-muted-foreground truncate">{tx.note}</p>}
        </div>
      </button>
      <div className="flex items-center gap-3">
        <span className={`font-mono text-base ${amountColor}`}>
          {sign} {formatCurrency(Number(tx.amount), currency, locale)}
        </span>
        <button
          onClick={handleDelete}
          className="text-xs text-muted-foreground hover:text-expense p-2"
          aria-label="delete"
        >
          ×
        </button>
      </div>
    </div>
  )
}
