import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

const documents = [
  { name: "Entertainment Transportation CBA 2024–2027", type: "Contract", size: "2.4 MB", updated: "Jan 15, 2026" },
  { name: "Freight & Logistics CBA 2023–2026", type: "Contract", size: "1.8 MB", updated: "Mar 1, 2023" },
  { name: "Sanitation Workers Agreement 2025–2028", type: "Contract", size: "1.2 MB", updated: "Jul 10, 2025" },
  { name: "2026 Health Plan Summary (Blue Cross)", type: "Benefits", size: "890 KB", updated: "Jan 1, 2026" },
  { name: "Pension Plan Benefit Statement — 2025", type: "Benefits", size: "340 KB", updated: "Dec 15, 2025" },
  { name: "Grievance Procedure Guide", type: "Guide", size: "210 KB", updated: "Apr 1, 2024" },
  { name: "New Member Orientation Packet", type: "Guide", size: "1.1 MB", updated: "Feb 1, 2026" },
  { name: "W-2 / Tax Form — 2025", type: "Tax", size: "180 KB", updated: "Jan 31, 2026" },
  { name: "Dues Deduction Authorization Form", type: "Form", size: "95 KB", updated: "Aug 1, 2023" },
  { name: "Hardship Fund Application", type: "Form", size: "120 KB", updated: "Jun 1, 2024" },
]

const typeColors: Record<string, string> = {
  Contract: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Benefits: "bg-green-500/15 text-green-400 border-green-500/20",
  Guide: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Tax: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Form: "bg-orange-500/15 text-orange-400 border-orange-500/20",
}

export default function DocumentsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Documents</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-3xl">
            <div className="mb-6">
              <h1 className="text-xl font-bold mb-1">Member Documents</h1>
              <p className="text-sm text-muted-foreground">
                Contracts, benefits summaries, forms, and guides for Local 728 members.
              </p>
            </div>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:bg-accent/40 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {doc.updated} · {doc.size}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${typeColors[doc.type]}`}>
                    {doc.type}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
