import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SplashController } from "@/components/splash-controller"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { OnboardingChart } from "@/components/dashboard/onboarding-chart"
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar"
import { DriverApplications } from "@/components/dashboard/driver-applications"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <SplashController />
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-4 space-y-4">
          <StatsCards />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OnboardingChart />
            </div>
            <DashboardCalendar />
          </div>
          <DriverApplications />
        </main>
      </div>
    </SidebarProvider>
  )
}
