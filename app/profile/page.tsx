"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Camera } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type Role = "coordinator" | "captain" | "dispatcher" | "driver"

const roles: {
  value: Role
  label: string
  color: string
  bg: string
  description: string
  access: string[]
}[] = [
  {
    value: "coordinator",
    label: "Coordinator",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    description: "Full portal access — manages all departments, apps, and member data.",
    access: ["Union Portal", "ATSB Transpo Hub", "Custom Apps", "All admin features"],
  },
  {
    value: "captain",
    label: "Captain",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    description: "Transportation operations lead — manages crews, call sheets, and dispatch.",
    access: ["Union Portal", "ATSB Transpo Hub", "Call Sheet", "Driver Roster"],
  },
  {
    value: "dispatcher",
    label: "Dispatcher",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    description: "Handles dispatch assignments, job board, and driver check-ins.",
    access: ["Union Portal", "Job Dispatch", "Applications", "Crew Chat"],
  },
  {
    value: "driver",
    label: "Driver",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    description: "Standard member access — view dues, dispatch board, and personal documents.",
    access: ["Members Hub", "Dues & Payments", "Job Dispatch", "My Documents", "Grievances"],
  },
]

export default function ProfilePage() {
  const [userId,      setUserId]     = useState("")
  const [name,        setName]       = useState("")
  const [email,       setEmail]      = useState("")
  const [avatarUrl,   setAvatarUrl]  = useState("")
  const [role,        setRole]       = useState<Role>("coordinator")
  const [savedRole,   setSavedRole]  = useState<Role>("coordinator")
  const [saving,      setSaving]     = useState(false)
  const [saved,       setSaved]      = useState(false)
  const [error,       setError]      = useState("")

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      setEmail(user.email ?? "")

      const meta = user.user_metadata ?? {}
      const googleName   = meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? ""
      const googleAvatar = meta.avatar_url ?? meta.picture ?? ""
      setAvatarUrl(googleAvatar)

      // Try profiles table — fall back to Google metadata
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, user_role")
        .eq("id", user.id)
        .single()

      setName(profile?.user_name || googleName)
      const r = (profile?.user_role as Role) || "coordinator"
      setRole(r)
      setSavedRole(r)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setError("")
    setSaved(false)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, user_name: name.trim(), user_role: role })

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setSavedRole(role)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const selectedRole = roles.find((r) => r.value === role)!
  const hasChanges   = name !== "" && (role !== savedRole || saved === false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">My Profile</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-2xl">
            <form onSubmit={handleSave} className="space-y-5">

              {/* ── Avatar + basic info ───────────────────────────────── */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={name}
                          referrerPolicy="no-referrer"
                          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border"
                        />
                      ) : (
                        <div
                          className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black ring-2 ring-border"
                          style={{ backgroundColor: selectedRole.bg, color: selectedRole.color }}
                        >
                          {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-2 ring-background">
                        <Camera className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <Input value={email} disabled className="text-muted-foreground" />
                        <p className="text-[11px] text-muted-foreground">
                          Managed by Google — change in your Google account.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── Role / Position (RBAC) ───────────────────────────── */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Position & Access Level
                    {savedRole && (
                      <Badge
                        className="text-[10px] px-2 border"
                        style={{
                          backgroundColor: roleBadgeBg(savedRole),
                          color: roleBadgeColor(savedRole),
                          borderColor: roleBadgeBorder(savedRole),
                        }}
                      >
                        {savedRole.charAt(0).toUpperCase() + savedRole.slice(1)}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Your position controls which sections of the portal you can access (RBAC). Select the role that matches your actual job.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {roles.map((r) => {
                      const selected = role === r.value
                      return (
                        <button
                          type="button"
                          key={r.value}
                          onClick={() => setRole(r.value)}
                          className="rounded-xl border p-4 text-left transition-all"
                          style={{
                            borderColor: selected ? r.color : "hsl(var(--border))",
                            backgroundColor: selected ? r.bg : "transparent",
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="text-sm font-semibold"
                              style={{ color: selected ? r.color : "hsl(var(--foreground))" }}
                            >
                              {r.label}
                            </span>
                            {selected && (
                              <CheckCircle className="h-4 w-4" style={{ color: r.color }} />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">
                            {r.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {r.access.map((a) => (
                              <span
                                key={a}
                                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                style={{
                                  backgroundColor: selected ? `${r.color}22` : "hsl(var(--muted))",
                                  color: selected ? r.color : "hsl(var(--muted-foreground))",
                                }}
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* ── Save ────────────────────────────────────────────── */}
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error} — make sure the profiles table migration has been run.
                </p>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? "Saving…" : "Save Profile"}
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" /> Saved
                  </span>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleBadgeColor(r: Role) {
  return { coordinator: "#a855f7", captain: "#3b82f6", dispatcher: "#22c55e", driver: "#f97316" }[r]
}
function roleBadgeBg(r: Role) {
  return { coordinator: "rgba(168,85,247,0.12)", captain: "rgba(59,130,246,0.12)", dispatcher: "rgba(34,197,94,0.12)", driver: "rgba(249,115,22,0.12)" }[r]
}
function roleBadgeBorder(r: Role) {
  return { coordinator: "rgba(168,85,247,0.3)", captain: "rgba(59,130,246,0.3)", dispatcher: "rgba(34,197,94,0.3)", driver: "rgba(249,115,22,0.3)" }[r]
}
