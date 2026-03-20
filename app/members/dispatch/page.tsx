"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, CheckCircle } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Production Driver — 15-Passenger Van",
    employer: "Summit Pictures",
    location: "Pinewood Studios, Atlanta",
    posted: "Mar 19, 2026",
    skills: ["CDL-B", "Entertainment"],
    trade: "entertainment",
  },
  {
    id: 2,
    title: "Fuel Truck Operator",
    employer: "ATSB Transportation",
    location: "Base Camp — Peachtree City",
    posted: "Mar 19, 2026",
    skills: ["CDL-A", "HazMat"],
    trade: "entertainment",
  },
  {
    id: 3,
    title: "Over-the-Road Driver",
    employer: "Atlas Freight Co.",
    location: "Atlanta, GA → Nashville, TN",
    posted: "Mar 18, 2026",
    skills: ["CDL-A", "OTR"],
    trade: "freight",
  },
  {
    id: 4,
    title: "Sanitation Route Driver",
    employer: "City of Atlanta",
    location: "Southeast Atlanta",
    posted: "Mar 18, 2026",
    skills: ["CDL-B"],
    trade: "sanitation",
  },
  {
    id: 5,
    title: "Forklift Operator — Distribution",
    employer: "Peachtree Distribution",
    location: "Forest Park, GA",
    posted: "Mar 17, 2026",
    skills: ["Forklift Cert."],
    trade: "warehouse",
  },
  {
    id: 6,
    title: "Picture Car Coordinator",
    employer: "Lionsgate Films",
    location: "Trilith Studios, Fayetteville",
    posted: "Mar 17, 2026",
    skills: ["Entertainment", "Coordination"],
    trade: "entertainment",
  },
]

export default function DispatchPage() {
  const [search, setSearch] = useState("")
  const [trade, setTrade] = useState<string>("all")
  const [requested, setRequested] = useState<number[]>([])

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.employer.toLowerCase().includes(search.toLowerCase())
    const matchTrade = trade === "all" || j.trade === trade
    return matchSearch && matchTrade
  })

  function request(id: number) {
    setRequested((prev) => [...prev, id])
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Job Dispatch</span>
          <Badge variant="secondary" className="ml-2">{jobs.length} Open</Badge>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-4xl space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or employers…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={trade} onValueChange={(v) => setTrade(v ?? "all")}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="freight">Freight</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="w-32" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium text-sm max-w-[200px]">{job.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{job.employer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{job.location}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{job.posted}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {requested.includes(job.id) ? (
                            <div className="flex items-center gap-1.5 text-xs text-green-400">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Requested
                            </div>
                          ) : (
                            <Button size="sm" className="h-7 text-xs" onClick={() => request(job.id)}>
                              Request Dispatch
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          No jobs match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
