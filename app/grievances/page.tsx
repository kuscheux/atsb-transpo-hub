"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { AlertTriangle, CheckCircle, Upload, Plus, X } from "lucide-react"

const openGrievances = [
  {
    id: "GR-2026-041",
    type: "Overtime Violation",
    employer: "Summit Pictures",
    filed: "Mar 12, 2026",
    rep: "Angela Kim",
    status: "In Review",
    desc: "Employer failed to pay double-time for hours worked beyond 12 on production day.",
  },
  {
    id: "GR-2026-028",
    type: "Improper Demotion",
    employer: "Atlas Freight Co.",
    filed: "Feb 28, 2026",
    rep: "Robert Tanner",
    status: "Resolved",
    desc: "Reassigned to lesser classification without just cause or proper notice.",
  },
  {
    id: "GR-2026-014",
    type: "Safety Violation",
    employer: "City of Atlanta",
    filed: "Jan 21, 2026",
    rep: "Denise Carter",
    status: "Open",
    desc: "Driver required to operate vehicle with known brake deficiency.",
  },
]

const statusColors: Record<string, string> = {
  "In Review": "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Open: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Resolved: "bg-green-500/15 text-green-400 border-green-500/20",
}

export default function GrievancesPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Grievance Tracker</span>
          <div className="ml-auto">
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => { setShowForm(!showForm); setSubmitted(false) }}
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showForm ? "Cancel" : "File Grievance"}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-3xl space-y-5">
            {/* File new grievance form */}
            {showForm && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    File a New Grievance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="flex flex-col items-center py-8 gap-3 text-center">
                      <CheckCircle className="h-10 w-10 text-green-400" />
                      <p className="font-bold">Grievance Filed</p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Your case has been submitted. A business agent will contact you within 2 business days.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => { setSubmitted(false); setShowForm(false) }}
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Grievance Type</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="overtime">Overtime Violation</SelectItem>
                              <SelectItem value="discipline">Unjust Discipline</SelectItem>
                              <SelectItem value="safety">Safety Violation</SelectItem>
                              <SelectItem value="scheduling">Scheduling Dispute</SelectItem>
                              <SelectItem value="termination">Wrongful Termination</SelectItem>
                              <SelectItem value="wages">Wage Discrepancy</SelectItem>
                              <SelectItem value="other">Other Contract Violation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Employer</Label>
                          <Input placeholder="Summit Pictures" required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Date of Incident</Label>
                        <Input type="date" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="Describe the contract violation in detail. Include dates, people involved, and what you believe the employer did wrong."
                          rows={5}
                          required
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Relevant Contract Article (if known)</Label>
                        <Input placeholder="Article 15, Section 3 — Overtime" />
                      </div>
                      <div
                        className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Attach Supporting Documents</p>
                          <p className="text-xs text-muted-foreground">
                            Time records, texts, schedules — any evidence of the violation
                          </p>
                        </div>
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Submit Grievance
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Open grievances table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Grievances</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Filed</TableHead>
                      <TableHead>Rep</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openGrievances.map((g) => (
                      <TableRow key={g.id} className="cursor-pointer">
                        <TableCell className="font-mono text-xs text-muted-foreground">{g.id}</TableCell>
                        <TableCell className="text-sm font-medium">{g.type}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{g.employer}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{g.filed}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{g.rep}</TableCell>
                        <TableCell>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[g.status]}`}>
                            {g.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
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
