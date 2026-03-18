import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeSettings } from "@/components/settings/theme-settings"

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Settings</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-base font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a color theme for the app.
              </p>
            </div>
            <ThemeSettings />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
