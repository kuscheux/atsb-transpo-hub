"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/union/public-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react"

const steps = ["Personal Info", "Employment", "Eligibility", "Submit"]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: i < current ? "#C9A84C" : i === current ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.08)",
                color: i <= current ? (i < current ? "#0A1628" : "#C9A84C") : "rgba(255,255,255,0.35)",
                border: i === current ? "1.5px solid #C9A84C" : "none",
              }}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === current ? "#C9A84C" : i < current ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="h-px w-6 mx-1" style={{ backgroundColor: i < current ? "#C9A84C" : "rgba(255,255,255,0.1)" }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  return (
    <PublicLayout>
      {/* Header */}
      <div className="py-16" style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>
            New Member
          </p>
          <h1 className="text-4xl font-black text-white">Join Teamsters Local 728</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Complete the application below. A business agent will contact you within 2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submitted ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <CheckCircle className="h-14 w-14 mx-auto mb-5" style={{ color: "#C9A84C" }} />
            <h2 className="text-2xl font-black text-white mb-3">Application Submitted</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              Thank you for applying to join Teamsters Local 728. A business agent will review your application and
              reach out within 2 business days to complete the enrollment process.
            </p>
            <p className="text-xs font-bold" style={{ color: "#C9A84C" }}>
              ✊ Welcome to the brotherhood.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            <StepIndicator current={step} />

            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-white mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs">First Name</Label>
                    <Input placeholder="Marcus" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs">Last Name</Label>
                    <Input placeholder="Webb" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Date of Birth</Label>
                  <Input type="date" className="bg-[#0A1628] border-white/10 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Phone Number</Label>
                  <Input placeholder="(404) 555-0100" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Email Address</Label>
                  <Input type="email" placeholder="you@email.com" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Home Address</Label>
                  <Input placeholder="123 Main St, Atlanta, GA 30301" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-white mb-4">Employment Details</h2>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Current Employer</Label>
                  <Input placeholder="ATSB Productions, Peachtree Logistics, etc." className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Job Title / Classification</Label>
                  <Input placeholder="CDL Driver, Production Driver, etc." className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Industry / Division</Label>
                  <Select>
                    <SelectTrigger className="bg-[#0A1628] border-white/10 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entertainment">Entertainment Transportation</SelectItem>
                      <SelectItem value="freight">Freight & Logistics</SelectItem>
                      <SelectItem value="sanitation">Sanitation & Public Works</SelectItem>
                      <SelectItem value="warehouse">Warehouse & Distribution</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">CDL License Class (if applicable)</Label>
                  <Select>
                    <SelectTrigger className="bg-[#0A1628] border-white/10 text-white">
                      <SelectValue placeholder="Select CDL class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No CDL</SelectItem>
                      <SelectItem value="a">Class A</SelectItem>
                      <SelectItem value="b">Class B</SelectItem>
                      <SelectItem value="c">Class C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">Years in Current Trade</Label>
                  <Input type="number" placeholder="5" min="0" className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-white mb-4">Eligibility</h2>
                <div
                  className="rounded-lg p-4 text-sm"
                  style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  <p className="font-semibold mb-1" style={{ color: "#C9A84C" }}>⚠️ Important</p>
                  <p style={{ color: "rgba(255,255,255,0.65)" }}>
                    To be eligible for membership, you must be employed in a trade or industry covered by Local 728 agreements. Membership is not automatic — a business agent will verify your employment.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "I am employed in a covered industry under Local 728 jurisdiction.",
                    "I am not currently under a dues obligation to another IBT local.",
                    "I understand that initiation fees and first-month dues are required upon acceptance.",
                    "I authorize Local 728 to verify my employment information.",
                  ].map((text, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-0.5 accent-[#C9A84C]" />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        {text}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white text-xs">How did you hear about us?</Label>
                  <Select>
                    <SelectTrigger className="bg-[#0A1628] border-white/10 text-white">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coworker">Coworker or fellow member</SelectItem>
                      <SelectItem value="organizer">Union organizer</SelectItem>
                      <SelectItem value="employer">Referred by employer</SelectItem>
                      <SelectItem value="online">Found online</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button
                  variant="outline"
                  className="gap-2 text-white bg-transparent"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  onClick={() => setStep(step - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                className="gap-2 ml-auto font-semibold"
                style={{ backgroundColor: "#C9A84C", color: "#0A1628" }}
                onClick={() => {
                  if (step < steps.length - 1) setStep(step + 1)
                  else setSubmitted(true)
                }}
              >
                {step < steps.length - 1 ? "Continue" : "Submit Application"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
