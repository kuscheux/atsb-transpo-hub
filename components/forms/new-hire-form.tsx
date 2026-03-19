"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Truck,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react"
import { sounds } from "@/lib/sounds"

type FormData = {
  driverName: string
  phoneNumber: string
  email: string
  last5SSN: string
  hiredToDrive: string
  ackWorkTimes: boolean
  ackVehicleSwap: boolean
  ackTimecard: boolean
}

type Step = "intro" | "form" | "success"

const contacts = [
  { role: "Transportation Coordinator", name: "Donny Thrift", phone: "(478) 387-6557" },
  { role: "Transportation Captain", name: "Jack Herrin", phone: "(706) 818-5929" },
  { role: "Co-Captain", name: "Chris Alexander", phone: "(770) 864-7716" },
  { role: "Dispatcher", name: "Taylor Evanoff", phone: "(702) 279-3440" },
  { role: "DOT Administrator", name: "Audrey Clarke", phone: "(770) 862-6545" },
]

export function NewHireForm() {
  const [step, setStep] = useState<Step>("intro")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<FormData>({
    driverName: "",
    phoneNumber: "",
    email: "",
    last5SSN: "",
    hiredToDrive: "",
    ackWorkTimes: false,
    ackVehicleSwap: false,
    ackTimecard: false,
  })

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const canSubmit =
    form.driverName &&
    form.phoneNumber &&
    form.email &&
    form.last5SSN &&
    form.ackWorkTimes &&
    form.ackVehicleSwap &&
    form.ackTimecard

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/driver-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_name: form.driverName,
          phone_number: form.phoneNumber,
          email: form.email,
          last_5_ssn: form.last5SSN,
          hired_to_drive: form.hiredToDrive,
          acknowledged_work_times: form.ackWorkTimes,
          acknowledged_vehicle_swap: form.ackVehicleSwap,
          acknowledged_timecard: form.ackTimecard,
        }),
      })
      if (!res.ok) throw new Error("Submission failed")
      sounds.success()
      setStep("success")
    } catch {
      sounds.error()
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">You're Submitted!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome to the ATSB Transportation crew, {form.driverName.split(" ")[0]}.
              </p>
            </div>
            <Separator />
            <div className="space-y-2 text-left text-sm">
              <p className="font-medium">What happens next:</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500">1.</span>
                  You'll receive a <strong className="text-foreground">Greenslate</strong> email to complete start paperwork
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500">2.</span>
                  On your start date, text your unit + tag numbers to Audrey (DOT) and your dispatcher
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500">3.</span>
                  Text your daily wrap times after every shift
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500">4.</span>
                  Approve your timecard in Greenslate every week
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500">
              ⚠️ Paperwork NOT completed = NO timecard = NO paycheck
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "intro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-sidebar-primary/10 p-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ATSB Transportation</h1>
            <p className="text-sm text-muted-foreground">New Hire Onboarding</p>
            <Badge variant="outline">Union 728</Badge>
          </div>

          {/* Welcome card */}
          <Card>
            <CardContent className="pt-6 space-y-4 text-sm">
              <p className="text-muted-foreground">
                Welcome to the crew. Complete this form to get set up for{" "}
                <strong className="text-foreground">DOT compliance</strong> and{" "}
                <strong className="text-foreground">payroll</strong>.
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="text-xs text-amber-500 space-y-1">
                    <p>Start paperwork NOT completed = NO timecard</p>
                    <p>NO timecard = NO paycheck</p>
                    <p>Timecards MUST be approved in Greenslate each week</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  On your start date, send to both DOT & Dispatch:
                </p>
                <div className="rounded-lg bg-muted p-3 text-xs space-y-1 text-muted-foreground font-mono">
                  <p>Driver Name:</p>
                  <p>Unit Number(s):</p>
                  <p>Tag Number(s):</p>
                  <p>Last 5 of SSN:</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border p-2 space-y-0.5">
                    <p className="font-medium text-foreground">Audrey Clarke</p>
                    <p className="text-muted-foreground">DOT Admin</p>
                    <a href="tel:7708626545" className="text-primary flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      770-862-6545
                    </a>
                  </div>
                  <div className="rounded-lg border p-2 space-y-0.5">
                    <p className="font-medium text-foreground">Taylor Evanoff</p>
                    <p className="text-muted-foreground">Dispatcher</p>
                    <a href="tel:7022793440" className="text-primary flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      702-279-3440
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Contacts */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Contacts</p>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {contacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">{c.role}</span>
                  </div>
                  <a href={`tel:${c.phone.replace(/\D/g, "")}`} className="text-primary text-xs">
                    {c.phone}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button className="w-full gap-2" size="lg" onClick={() => { sounds.click(); setStep("form") }}>
            Begin New Hire Form
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">New Hire Form</h1>
          <p className="text-sm text-muted-foreground mt-1">ATSB Transportation · Union 728</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="driverName">Full Name *</Label>
                <Input
                  id="driverName"
                  placeholder="First Last"
                  value={form.driverName}
                  onChange={(e) => set("driverName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ssn">Last 5 of SSN *</Label>
                <Input
                  id="ssn"
                  placeholder="XXXXX"
                  maxLength={5}
                  value={form.last5SSN}
                  onChange={(e) => set("last5SSN", e.target.value.replace(/\D/g, ""))}
                  required
                />
                <p className="text-xs text-muted-foreground">Required for DOT compliance and payroll</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vehicle">What the Captain Hired You to Drive</Label>
                <Input
                  id="vehicle"
                  placeholder="e.g. Sprinter Van, 3 Axle Tractor, Stakebed..."
                  value={form.hiredToDrive}
                  onChange={(e) => set("hiredToDrive", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You won't receive your unit number until your start date
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold">Driver Acknowledgements *</p>
              <p className="text-xs text-muted-foreground -mt-2">
                All three must be checked to submit
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.ackWorkTimes}
                    onCheckedChange={(v) => { sounds.toggle(); set("ackWorkTimes", !!v) }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-snug">
                    I will text my daily work times to the dispatcher after every work shift
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.ackVehicleSwap}
                    onCheckedChange={(v) => { sounds.toggle(); set("ackVehicleSwap", !!v) }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-snug">
                    If I swap vehicles, I will notify DOT and Dispatch with the new unit and tag numbers
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.ackTimecard}
                    onCheckedChange={(v) => { sounds.toggle(); set("ackTimecard", !!v) }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-snug">
                    If I do not receive my Greenslate timecard by Tuesday morning, I will contact the coordinator immediately to resolve it
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("intro")}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex-2 flex-grow"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">
              A Greenslate invitation will be sent to your email automatically
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
