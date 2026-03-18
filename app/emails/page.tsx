import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { EmailImporter } from '@/components/emails/email-importer'

export default function EmailsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Email Import</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <EmailImporter />
        </main>
      </div>
    </SidebarProvider>
  )
}
