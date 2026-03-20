import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { OnboardingChart } from "@/components/dashboard/onboarding-chart"
import { CallSheetTable } from "@/components/dashboard/call-sheet-table"
import { DriverApplications } from "@/components/dashboard/driver-applications"
import { RealTimeChat } from "@/components/chat/real-time-chat"
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { SplashController } from "@/components/splash-controller"

export default function TranspoHubPage() {
  return (
    <SidebarProvider>
      <SplashController />
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Transportation Hub</span>
          <div className="ml-auto flex items-center gap-2">
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
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0 space-y-4">
              <StatsCards />
              <OnboardingChart />
              <DriverApplications />
              <CallSheetTable />
            </div>
            <div className="w-72 shrink-0 space-y-4 sticky top-0">
              <DashboardCalendar />
              <RealTimeChat />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
