"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CreditCard, CheckCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const history = [
  { date: "Mar 1, 2026", amount: "$68.50", method: "Online", status: "Paid" },
  { date: "Feb 1, 2026", amount: "$68.50", method: "Online", status: "Paid" },
  { date: "Jan 1, 2026", amount: "$68.50", method: "Online", status: "Paid" },
  { date: "Dec 1, 2025", amount: "$68.50", method: "Check", status: "Paid" },
  { date: "Nov 1, 2025", amount: "$68.50", method: "Online", status: "Paid" },
]

export default function DuesPage() {
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setPaid(true)
    setLoading(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Dues & Payments</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-3xl space-y-5">
            {/* Balance card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Current Balance", value: "$68.50", sub: "Due April 1, 2026", color: "text-yellow-400" },
                { label: "YTD Paid", value: "$205.50", sub: "Jan – Mar 2026", color: "text-foreground" },
                { label: "Member Since", value: "2019", sub: "7 years standing", color: "text-foreground" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/25 bg-yellow-500/8 px-4 py-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-yellow-200/80">
                <strong className="text-yellow-400">Do not pay if you are not already a dues-paying member.</strong>{" "}
                New members must complete the registration process first. Contact the hall at (404) 622-1728.
              </p>
            </div>

            {/* Pay form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Pay Online
                </CardTitle>
                <CardDescription>A 1.5% processing fee applies to online card payments.</CardDescription>
              </CardHeader>
              <CardContent>
                {paid ? (
                  <div className="flex flex-col items-center py-8 gap-3 text-center">
                    <CheckCircle className="h-12 w-12 text-green-400" />
                    <p className="text-lg font-bold">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      $69.53 charged (incl. 1.5% fee). Receipt sent to your email.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setPaid(false)}>
                      Make Another Payment
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePay} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="Marcus Webb" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="card">Card Number</Label>
                      <Input id="card" placeholder="4242 4242 4242 4242" maxLength={19} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="exp">Expiry</Label>
                        <Input id="exp" placeholder="MM / YY" maxLength={7} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" maxLength={4} required />
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-3 text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">April dues + 1.5% fee</span>
                      <span className="font-semibold">$69.53</span>
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      <CreditCard className="h-4 w-4" />
                      {loading ? "Processing…" : "Pay $69.53"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell className="text-sm">{row.date}</TableCell>
                        <TableCell className="text-sm font-mono">{row.amount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.method}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/20">
                            {row.status}
                          </Badge>
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
