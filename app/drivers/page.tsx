import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { DriverApplications } from "@/components/dashboard/driver-applications"

export default function DriversPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Driver Roster</span>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <DriverApplications />
        </main>
      </div>
    </SidebarProvider>
  )
}
