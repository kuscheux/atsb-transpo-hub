import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { CallSheetTable } from "@/components/dashboard/call-sheet-table"

export default function CallSheetPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Call Sheet</span>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <CallSheetTable />
        </main>
      </div>
    </SidebarProvider>
  )
}
