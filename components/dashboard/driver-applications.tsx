"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MessageSquare, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { sounds } from "@/lib/sounds"

type Application = {
  id: string
  created_at: string
  driver_name: string
  phone_number: string
  email: string
  hired_to_drive: string
  status: "pending" | "approved" | "onboarded"
  invite_sent: boolean
  invite_sent_at: string | null
}

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  approved: { label: "Approved", variant: "default" as const },
  onboarded: { label: "Onboarded", variant: "outline" as const },
}

export function DriverApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()

    const channel = supabase
      .channel("driver_applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "driver_applications" },
        () => fetchApplications()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchApplications() {
    const { data } = await supabase
      .from("driver_applications")
      .select("*")
      .order("created_at", { ascending: false })
    setApplications((data as Application[]) ?? [])
    setLoading(false)
  }

  async function sendInvite(app: Application, resend = false) {
    sounds.send()
    await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: app.id, phone: app.phone_number, name: app.driver_name, resend }),
    })
    fetchApplications()
  }

  async function updateStatus(id: string, status: Application["status"]) {
    if (status === "approved") sounds.approve()
    else if (status === "onboarded") sounds.success()
    else sounds.click()
    await supabase.from("driver_applications").update({ status }).eq("id", id)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading applications...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          New Hire Applications
          {applications.length > 0 && (
            <Badge variant="secondary">{applications.length}</Badge>
          )}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => { sounds.click(); fetchApplications() }} className="gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {applications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">No applications yet.</p>
            <p className="mt-1 text-xs">Share the new hire form link with drivers.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invite</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.driver_name}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{app.phone_number}</TableCell>
                  <TableCell className="text-sm">{app.hired_to_drive || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[app.status].variant}>
                      {statusConfig[app.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app.invite_sent ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() => sendInvite(app, true)}
                      >
                        <RefreshCw className="h-3 w-3" />
                        Resend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => sendInvite(app, false)}
                      >
                        <MessageSquare className="h-3 w-3" />
                        Send Text
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(app.id, "approved")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, "onboarded")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                          Mark Onboarded
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => updateStatus(app.id, "pending")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reset to Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
