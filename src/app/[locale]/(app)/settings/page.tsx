import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const t = await getTranslations("settings")
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t("title")}</h1>
      <ul className="border border-border rounded-md divide-y divide-border">
        <li>
          <Link
            href="/settings/categories"
            className="flex items-center justify-between px-4 h-14 hover:bg-surface"
          >
            <span>{t("categories")}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </li>
        <li className="px-4 h-14 flex flex-col justify-center">
          <span className="text-sm text-muted-foreground">{t("account")}</span>
          <span className="text-sm">{t("signedInAs", { email: user?.email ?? "" })}</span>
        </li>
        <li>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-4 h-14 text-expense hover:bg-surface"
            >
              {t("signOut")}
            </button>
          </form>
        </li>
      </ul>
    </div>
  )
}
