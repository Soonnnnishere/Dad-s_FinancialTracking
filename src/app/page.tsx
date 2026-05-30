import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Home() {
  return (
    <main className="p-6">
      <Button>
        <Plus className="size-4" /> Test
      </Button>
    </main>
  )
}
