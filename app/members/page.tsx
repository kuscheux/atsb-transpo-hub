"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Briefcase, AlertTriangle, FileText, Truck, ChevronRight, Calendar, Mail, MessageCircle, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

const quickActions = [
  { icon: CreditCard, label: "Pay Dues", sub: "Next due: Apr 1", href: "/members/dues", color: "text-green-400" },
  { icon: Briefcase, label: "Job Dispatch", sub: "3 openings today", href: "/members/dispatch", color: "text-blue-400" },
  { icon: AlertTriangle, label: "File Grievance", sub: "Track your cases", href: "/grievances", color: "text-yellow-400" },
  { icon: FileText, label: "My Documents", sub: "Contracts, forms", href: "/members/documents", color: "text-purple-400" },
]

const recentGrievances = [
  { id: "GR-2026-041", employer: "Summit Pictures", type: "Overtime Violation", filed: "Mar 12, 2026", status: "In Review" },
  { id: "GR-2026-028", employer: "Atlas Freight Co.", type: "Improper Demotion", filed: "Feb 28, 2026", status: "Resolved" },
]

const upcomingEvents = [
  { date: "Apr 2", title: "Q1 General Membership Meeting", location: "Union Hall" },
  { date: "Apr 12", title: "CDL Safety Training", location: "Union Hall — Training Room" },
  { date: "Apr 15", title: "Health Plan Open Enrollment Deadline", location: "Online / HR Office" },
]

const statusColors: Record<string, string> = {
  "In Review": "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Open: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Resolved: "bg-green-500/15 text-green-400 border-green-500/20",
}

export default function MembersPage() {
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Set from Google metadata immediately
      const meta = user.user_metadata ?? {}
      setUserName(meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "")

      // Override with profile table if available
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, user_role")
        .eq("id", user.id)
        .single()
      if (profile?.user_name) setUserName(profile.user_name)
      if (profile?.user_role) setUserRole(profile.user_role)
    }
    load()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Member Hub</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-4xl space-y-6">
            {/* Welcome + member card */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Welcome */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-0.5">
                  Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
                </h1>
                <p className="text-sm text-muted-foreground">
                  Teamsters Local 728 · {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Member"}
                </p>
              </div>

              {/* Member card */}
              <div
                className="rounded-xl p-5 min-w-[260px]"
                style={{
                  background: "linear-gradient(135deg, #0d1f3c 0%, #0A1628 100%)",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black tracking-widest" style={{ color: "#C9A84C" }}>
                    TEAMSTERS LOCAL 728
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: "#C9A84C" }}>
                    ✊
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">Member Name</p>
                  <p className="text-white font-bold">{userName || "Loading…"}</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Member #</p>
                    <p className="text-white font-mono text-sm">728-04821</p>
                  </div>
                  <Badge className="text-[10px] px-2 py-0.5 bg-green-500/15 text-green-400 border border-green-500/20">
                    Dues Current
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-4">
                        <action.icon className={`h-5 w-5 mb-3 ${action.color}`} />
                        <p className="font-semibold text-sm">{action.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{action.sub}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Grievances */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Recent Grievances</CardTitle>
                  <Link href="/grievances">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
                      View All <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentGrievances.map((g) => (
                    <div key={g.id} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{g.id}</p>
                        <p className="text-sm font-medium">{g.type}</p>
                        <p className="text-xs text-muted-foreground">{g.employer} · {g.filed}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColors[g.status]}`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Upcoming Events</CardTitle>
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
                      View All <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.title} className="flex gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C" }}
                      >
                        {e.date}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {e.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Connected Apps */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Connected Apps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "ATSB Transpo", sub: "Transportation Hub", connected: true, href: "/apps/transpo" },
                  { icon: Mail, label: "Gmail", sub: "Connect to sync transpo emails", connected: false, href: "/settings/integrations" },
                  { icon: MessageCircle, label: "iMessage", sub: "Local — Full Disk Access required", connected: false, href: "/settings/integrations" },
                ].map((app) => (
                  <Link key={app.label} href={app.href}>
                    <div className="rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors flex items-center gap-3 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                        <app.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{app.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.sub}</p>
                      </div>
                      {app.connected ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Apps section */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Custom Apps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link href="/apps/transpo">
                  <div className="rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">ATSB Transpo</p>
                      <p className="text-xs text-muted-foreground">Coordinator Hub</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </Link>
                <Link href="/apps">
                  <div className="rounded-xl border border-dashed border-border p-4 hover:bg-accent/20 transition-colors flex items-center gap-3 cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <span className="text-lg">＋</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Browse All Apps</p>
                      <p className="text-xs text-muted-foreground">Custom app directory</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
