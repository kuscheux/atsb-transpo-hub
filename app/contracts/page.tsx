import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, ChevronRight } from "lucide-react"

const contracts = [
  {
    title: "Entertainment Transportation CBA",
    employers: ["Summit Pictures", "ATSB Productions", "Lionsgate Films", "+12 others"],
    effective: "Jan 1, 2024",
    expires: "Dec 31, 2027",
    members: 340,
    rep: "Angela Kim",
    highlights: ["12% wage increase over 3 years", "16-hr production day protections", "Meal penalty enforcement", "New safety language"],
    status: "Active",
  },
  {
    title: "Freight & Long-Haul CBA",
    employers: ["Atlas Freight Co.", "Peachtree Logistics"],
    effective: "Mar 1, 2023",
    expires: "Feb 28, 2026",
    members: 180,
    rep: "Robert Tanner",
    highlights: ["8.5% wage increase", "OTR per diem increase", "Electronic logging support", "New rest area provisions"],
    status: "Expiring Soon",
  },
  {
    title: "Sanitation & Public Works Agreement",
    employers: ["City of Atlanta", "DeKalb County"],
    effective: "Jul 1, 2025",
    expires: "Jun 30, 2028",
    members: 420,
    rep: "Denise Carter",
    highlights: ["8% first-year raise", "MLK Day as paid holiday", "Vehicle maintenance standards", "Improved PPE provisions"],
    status: "Active",
  },
  {
    title: "Warehouse & Distribution Agreement",
    employers: ["Peachtree Distribution", "Amazon DSP — ATL4"],
    effective: "Nov 1, 2024",
    expires: "Oct 31, 2027",
    members: 215,
    rep: "Robert Tanner",
    highlights: ["$1.50/hr night differential", "Forced overtime limits", "Heat safety standards", "Progressive discipline clause"],
    status: "Active",
  },
]

const statusColors: Record<string, string> = {
  Active: "bg-green-500/15 text-green-400 border-green-500/20",
  "Expiring Soon": "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  "In Negotiation": "bg-blue-500/15 text-blue-400 border-blue-500/20",
}

export default function ContractsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Contracts</span>
          <Badge variant="secondary" className="ml-2">{contracts.length} Active</Badge>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-4xl space-y-4">
            <div className="mb-2">
              <h1 className="text-xl font-bold mb-1">Active Agreements</h1>
              <p className="text-sm text-muted-foreground">
                Collective bargaining agreements currently in force for Local 728 members.
              </p>
            </div>

            {contracts.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-border bg-card p-5 space-y-4"
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex gap-3 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{c.title}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[c.status]}`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.employers.join(" · ")}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Effective</p>
                    <p className="font-medium">{c.effective}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Expires</p>
                    <p className="font-medium">{c.expires}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Members Covered</p>
                    <p className="font-medium">{c.members.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Key Wins</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    Business Agent: <span className="text-foreground font-medium">{c.rep}</span>
                  </p>
                  <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                    View Full Contract <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
