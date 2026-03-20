import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, ArrowRight, Lock, Bot, PersonStanding } from "lucide-react"

const apps = [
  {
    slug: "transpo",
    icon: Truck,
    name: "ATSB Transportation Hub",
    description:
      "Full coordinator hub for the ATSB entertainment transportation department. Manage driver applications, daily call sheets, crew chat, and the production calendar.",
    features: ["Driver Applications", "Call Sheet", "Crew Chat", "Production Calendar"],
    status: "active" as const,
    href: "/apps/transpo",
  },
  {
    slug: "ai",
    icon: Bot,
    name: "AI Assistant",
    description:
      "Intelligent assistant powered by Hugging Face. Ask about the call sheet, driver applications, calendar events, or search the knowledge base. Connects to Gmail and iMessage.",
    features: ["Live Data Tools", "Knowledge Base", "Gmail (coming)", "iMessage (local)"],
    status: "active" as const,
    href: "/apps/ai",
  },
  {
    slug: "animations",
    icon: PersonStanding,
    name: "Animation Viewer",
    description:
      "Browse and play Mixamo FBX animations stored in Supabase. Upload from ~/Downloads using the upload script.",
    features: ["Mixamo FBX", "Supabase Storage", "3D Viewer", "Auto-play"],
    status: "active" as const,
    href: "/apps/animations",
  },
  {
    slug: "dispatch",
    icon: null,
    name: "Dispatch Management System",
    description: "Advanced out-of-work list management, automated dispatch notifications, and hall dispatch tracking.",
    features: ["OWL Management", "SMS Notifications", "Dispatch Reports"],
    status: "coming" as const,
    href: null,
  },
  {
    slug: "grievance",
    icon: null,
    name: "Grievance Tracker Pro",
    description:
      "Enhanced grievance management with arbitration scheduling, document storage, and rep assignment tools.",
    features: ["Arbitration Scheduling", "Document Vault", "Rep Assignment"],
    status: "coming" as const,
    href: null,
  },
  {
    slug: "dues",
    icon: null,
    name: "Dues & Payroll Integration",
    description:
      "Direct payroll deduction integration with major employers, automated dues collection, and reconciliation.",
    features: ["Payroll Deduction", "Auto Reconciliation", "Late Fee Tracking"],
    status: "coming" as const,
    href: null,
  },
]

export default function AppsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Custom Apps</span>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Custom Apps</h1>
              <p className="text-sm text-muted-foreground">
                Specialized tools built for Local 728 departments and operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.map((app) => (
                <div
                  key={app.slug}
                  className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                        {app.icon ? (
                          <app.icon className="h-5 w-5 text-foreground" />
                        ) : (
                          <span className="text-lg">🔧</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{app.name}</p>
                        <Badge
                          variant={app.status === "active" ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0 h-4 mt-0.5"
                        >
                          {app.status === "active" ? "Active" : "Coming Soon"}
                        </Badge>
                      </div>
                    </div>
                    {app.status === "coming" && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {app.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {app.href ? (
                    <Link href={app.href} className="mt-auto">
                      <Button size="sm" className="gap-1.5 w-full">
                        Open App <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="mt-auto w-full gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Unavailable
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
