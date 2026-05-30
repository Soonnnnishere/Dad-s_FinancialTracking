import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import type { ReactElement } from "react"
import messages from "../../messages/zh-CN.json"
import { TransactionRow, type RowTx } from "@/components/transactions/TransactionRow"

vi.mock("@/lib/queries/transactions", () => ({
  deleteTransaction: vi.fn().mockResolvedValue(undefined),
  createTransaction: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

const tx: RowTx = {
  id: "t1",
  user_id: "u",
  category_id: "c1",
  kind: "expense",
  amount: 12.5,
  currency: "MYR",
  occurred_on: "2026-05-30",
  note: "lunch",
  created_at: "2026-05-30T00:00:00Z",
  category: {
    id: "c1",
    name: "餐饮",
    i18n_key: "food",
    kind: "expense",
    color: "#F97316",
    user_id: "u",
    is_archived: false,
    icon: null,
    created_at: "",
  },
}

function wrap(node: ReactElement) {
  return render(
    <NextIntlClientProvider locale="zh-CN" messages={messages}>
      {node}
    </NextIntlClientProvider>,
  )
}

describe("TransactionRow", () => {
  it("renders amount in expense color with the RM prefix and a minus sign", () => {
    wrap(<TransactionRow tx={tx} locale="zh-CN" currency="MYR" onEdit={() => {}} />)
    expect(screen.getByText("− RM 12.50")).toBeInTheDocument()
    expect(screen.getByText("餐饮")).toBeInTheDocument()
    expect(screen.getByText("lunch")).toBeInTheDocument()
  })

  it("invokes onEdit when the row body is clicked", async () => {
    const onEdit = vi.fn()
    wrap(<TransactionRow tx={tx} locale="zh-CN" currency="MYR" onEdit={onEdit} />)
    await userEvent.click(screen.getByText("餐饮"))
    expect(onEdit).toHaveBeenCalledWith(tx)
  })
})
