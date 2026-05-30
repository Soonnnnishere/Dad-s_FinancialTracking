import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import type { ReactElement } from "react"
import messages from "../../messages/zh-CN.json"
import { QuickAddSheet } from "@/components/transactions/QuickAddSheet"
import type { Category } from "@/lib/queries/categories"

const cats: Category[] = [
  {
    id: "1", name: "餐饮", i18n_key: "food", kind: "expense", color: "#F97316",
    icon: null, user_id: "u", is_archived: false, created_at: "",
  },
  {
    id: "2", name: "工资", i18n_key: "salary", kind: "income", color: "#16A34A",
    icon: null, user_id: "u", is_archived: false, created_at: "",
  },
]

function wrap(node: ReactElement) {
  return render(
    <NextIntlClientProvider locale="zh-CN" messages={messages}>
      {node}
    </NextIntlClientProvider>,
  )
}

describe("QuickAddSheet", () => {
  it("blocks save when amount is empty", async () => {
    const onSave = vi.fn()
    wrap(
      <QuickAddSheet
        open
        categories={cats}
        preselectId="1"
        onSave={onSave}
        onClose={() => {}}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "保存" }))
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByText("请输入金额")).toBeInTheDocument()
  })

  it("submits with the preselected category and entered amount", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    wrap(
      <QuickAddSheet
        open
        categories={cats}
        preselectId="1"
        onSave={onSave}
        onClose={() => {}}
      />,
    )
    await userEvent.type(screen.getByLabelText("金额"), "12.50")
    await userEvent.click(screen.getByRole("button", { name: "保存" }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ category_id: "1", amount: 12.5, kind: "expense" }),
    )
  })

  it("toggles kind to income when the income button is pressed", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    wrap(
      <QuickAddSheet
        open
        categories={cats}
        preselectId="2"
        onSave={onSave}
        onClose={() => {}}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "收入" }))
    await userEvent.type(screen.getByLabelText("金额"), "5000")
    await userEvent.click(screen.getByRole("button", { name: "保存" }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "income", amount: 5000 }),
    )
  })
})
