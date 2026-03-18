import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { DriverApplications } from "@/components/dashboard/driver-applications"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function ApplicationsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Applications</span>
          <div className="ml-auto">
            <Link
              href="/hire"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[0.8rem] font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Driver Hire Form
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <DriverApplications />
        </main>
      </div>
    </SidebarProvider>
  )
}
