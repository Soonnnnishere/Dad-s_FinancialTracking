import { describe, expect, it } from "vitest"
import { formatLongDate, formatShortDate, formatWeekday } from "@/lib/formatters/date"

describe("date formatters", () => {
  it("renders long date in zh-CN", () => {
    expect(formatLongDate("2026-05-30", "zh-CN")).toBe("2026年5月30日")
  })
  it("renders long date in en", () => {
    expect(formatLongDate("2026-05-30", "en")).toBe("May 30, 2026")
  })
  it("renders short date (M/D) in zh-CN", () => {
    expect(formatShortDate("2026-05-30", "zh-CN")).toBe("5/30")
  })
  it("renders weekday in zh-CN", () => {
    // 2026-05-30 is a Saturday
    expect(formatWeekday("2026-05-30", "zh-CN")).toBe("周六")
  })
  it("renders weekday in en", () => {
    expect(formatWeekday("2026-05-30", "en")).toBe("Sat")
  })
})
