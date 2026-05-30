import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import type { ComponentProps, ReactElement } from "react"
import messages from "../../messages/zh-CN.json"
import { CategoryChips } from "@/components/categories/CategoryChips"

type ChipCategory = ComponentProps<typeof CategoryChips>["categories"][number]

const cats: ChipCategory[] = [
  { id: "1", name: "餐饮", i18n_key: "food",      color: "#F97316" },
  { id: "2", name: "交通", i18n_key: "transport", color: "#3B82F6" },
]

function wrap(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="zh-CN" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  )
}

describe("CategoryChips", () => {
  it("renders localized labels for preset categories", () => {
    wrap(<CategoryChips categories={cats} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByRole("button", { name: "餐饮" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "交通" })).toBeInTheDocument()
  })

  it("marks the selected chip with aria-pressed=true", () => {
    wrap(<CategoryChips categories={cats} selectedId="1" onSelect={() => {}} />)
    expect(screen.getByRole("button", { name: "餐饮" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "交通" })).toHaveAttribute("aria-pressed", "false")
  })

  it("fires onSelect with the category id when a chip is tapped", async () => {
    const onSelect = vi.fn()
    wrap(<CategoryChips categories={cats} selectedId={null} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "交通" }))
    expect(onSelect).toHaveBeenCalledWith("2")
  })
})
