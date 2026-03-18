import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Fuel } from "lucide-react"

export default function FuelPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Fuel Cards</span>
        </header>
        <main className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Fuel className="h-10 w-10 opacity-30" />
            <p className="text-sm">Fuel card management coming soon</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
