"use client"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const t = useTranslations("signIn")

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-2xl font-medium">{t("title")}</h1>
      <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      <Button onClick={handleGoogle} size="lg" className="h-12 px-6 text-base">
        {t("googleButton")}
      </Button>
    </main>
  )
}
