import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("app")
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl">{t("title")}</h1>
      <p className="font-mono text-xl">RM 1,234.50</p>
    </main>
  )
}
