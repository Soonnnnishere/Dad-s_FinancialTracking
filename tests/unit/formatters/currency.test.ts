import { describe, expect, it } from "vitest"
import { formatCurrency } from "@/lib/formatters/currency"

describe("formatCurrency", () => {
  it("formats MYR in zh-CN with the RM symbol and grouping", () => {
    expect(formatCurrency(1234.5, "MYR", "zh-CN")).toBe("RM 1,234.50")
  })
  it("formats MYR in en the same way (RM is locale-agnostic)", () => {
    expect(formatCurrency(0.5, "MYR", "en")).toBe("RM 0.50")
  })
  it("renders 0 as RM 0.00", () => {
    expect(formatCurrency(0, "MYR", "zh-CN")).toBe("RM 0.00")
  })
  it("respects locale for grouping separators with very large values", () => {
    expect(formatCurrency(1000000, "MYR", "en")).toBe("RM 1,000,000.00")
  })
})
