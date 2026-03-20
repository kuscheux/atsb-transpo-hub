"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/union/public-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PublicLayout>
      {/* Header */}
      <div className="py-16" style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>
            Get in Touch
          </p>
          <h1 className="text-4xl font-black text-white">Contact Local 728</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Questions about membership, dues, grievances, or contracts? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-black text-white mb-6">Office Information</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    lines: ["2540 Lakewood Ave SW", "Atlanta, GA 30315"],
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    lines: ["(404) 622-1728", "Fax: (404) 622-1729"],
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    lines: ["info@teamsterslocal728.org", "grievances@teamsterslocal728.org"],
                  },
                  {
                    icon: Clock,
                    label: "Office Hours",
                    lines: ["Monday – Friday: 8:00 am – 5:00 pm", "Saturday – Sunday: Closed"],
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "rgba(201,168,76,0.12)" }}
                    >
                      <item.icon className="h-4 w-4" style={{ color: "#C9A84C" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: "#C9A84C" }}>
                        {item.label}
                      </p>
                      {item.lines.map((line) => (
                        <p key={line} className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="rounded-xl h-52 flex items-center justify-center"
              style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" style={{ color: "#C9A84C" }} />
                <p className="text-sm font-semibold text-white">2540 Lakewood Ave SW</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Atlanta, GA 30315</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-4 text-center">
                <CheckCircle className="h-12 w-12" style={{ color: "#C9A84C" }} />
                <h3 className="text-xl font-black text-white">Message Sent</h3>
                <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Thank you for reaching out. A member of our staff will respond within 1 business day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-white bg-transparent"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  onClick={() => setSent(false)}
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-white text-xs">First Name</Label>
                      <Input id="firstName" placeholder="Marcus" required className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-white text-xs">Last Name</Label>
                      <Input id="lastName" placeholder="Webb" required className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white text-xs">Email</Label>
                    <Input id="email" type="email" placeholder="you@email.com" required className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-white text-xs">Subject</Label>
                    <Input id="subject" placeholder="Grievance inquiry, dues question, etc." className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-white text-xs">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help…"
                      rows={5}
                      required
                      className="bg-[#0A1628] border-white/10 text-white placeholder:text-white/30 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    style={{ backgroundColor: "#C9A84C", color: "#0A1628" }}
                  >
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
