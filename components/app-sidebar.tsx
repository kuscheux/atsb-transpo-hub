"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  CreditCard,
  Briefcase,
  FileText,
  AlertTriangle,
  ScrollText,
  Calendar,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Fuel,
  Wrench,
  Settings,
  HelpCircle,
  ChevronUp,
  LogOut,
  Grid2x2,
  Truck,
  UserCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

// ── Role types ────────────────────────────────────────────────────────────────
type Role = "coordinator" | "captain" | "dispatcher" | "driver" | ""

// Which nav sections each role can see
const roleAccess: Record<string, { transpo: boolean; apps: boolean }> = {
  coordinator: { transpo: true,  apps: true  },
  captain:     { transpo: true,  apps: true  },
  dispatcher:  { transpo: true,  apps: false },
  driver:      { transpo: false, apps: false },
  "":          { transpo: true,  apps: true  }, // default until loaded
}

// ── Nav definitions ───────────────────────────────────────────────────────────
const navPortal = [
  { title: "Members Hub",     url: "/members",            icon: Users       },
  { title: "Dues & Payments", url: "/members/dues",       icon: CreditCard  },
  { title: "Job Dispatch",    url: "/members/dispatch",   icon: Briefcase   },
  { title: "Documents",       url: "/members/documents",  icon: FileText    },
  { title: "Grievances",      url: "/grievances",         icon: AlertTriangle },
  { title: "Contracts",       url: "/contracts",          icon: ScrollText  },
  { title: "Events",          url: "/events",             icon: Calendar    },
]

const navTranspo = [
  { title: "Dashboard",    url: "/apps/transpo",   icon: LayoutDashboard },
  { title: "Call Sheet",   url: "/call-sheet",     icon: FileText        },
  { title: "Driver Roster",url: "/drivers",        icon: Users           },
  { title: "Applications", url: "/applications",   icon: ClipboardList   },
  { title: "Crew Chat",    url: "/chat",           icon: MessageSquare   },
  { title: "Fuel Cards",   url: "/fuel",           icon: Fuel            },
  { title: "Equipment",    url: "/equipment",      icon: Wrench          },
]

const navBottom = [
  { title: "Integrations", url: "/settings/integrations", icon: Grid2x2  },
  { title: "Settings",     url: "/settings",              icon: Settings  },
  { title: "Get Help",     url: "/help",                  icon: HelpCircle },
]

// ── Role badge color ──────────────────────────────────────────────────────────
const roleBadge: Record<string, { label: string; color: string }> = {
  coordinator: { label: "Coordinator",  color: "#a855f7" },
  captain:     { label: "Captain",      color: "#3b82f6" },
  dispatcher:  { label: "Dispatcher",   color: "#22c55e" },
  driver:      { label: "Driver",       color: "#f97316" },
}

export function AppSidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [userName,  setUserName]  = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRole,  setUserRole]  = useState<Role>("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // ── 1. Set from Google metadata immediately (no DB round-trip needed) ──
      const meta = user.user_metadata ?? {}
      const googleName   = meta.full_name ?? meta.name ?? ""
      const googleAvatar = meta.avatar_url ?? meta.picture ?? ""

      setUserEmail(user.email ?? "")
      setAvatarUrl(googleAvatar)
      // Show Google name right away so it's never stuck on "Loading…"
      setUserName(googleName || user.email?.split("@")[0] || "")

      // ── 2. Override with profiles table if it exists ──────────────────────
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, user_role")
        .eq("id", user.id)
        .single()

      if (profile?.user_name) setUserName(profile.user_name)
      if (profile?.user_role) setUserRole(profile.user_role as Role)
    }

    loadProfile()
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "…"

  const access = roleAccess[userRole] ?? roleAccess[""]

  function isActive(url: string) {
    if (url === "/") return pathname === "/"
    return pathname === url || pathname.startsWith(url + "/")
  }

  const badge = roleBadge[userRole]

  return (
    <Sidebar>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/members" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shrink-0"
                style={{ backgroundColor: "#0A1628" }}>
                <Image
                  src="/teamsters-logo.png"
                  alt="Teamsters"
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Local 728 Portal</span>
                <span className="truncate text-xs text-muted-foreground">Member Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ── Union Portal ────────────────────────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel>Union Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPortal.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={isActive(item.url)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── ATSB Transpo (role-gated) ────────────────────────────── */}
        {access.transpo && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3 w-3" />
                ATSB Transpo
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navTranspo.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<Link href={item.url} />} isActive={isActive(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ── Custom Apps (coordinator only) ──────────────────────── */}
        {access.apps && (
          <SidebarGroup>
            <SidebarGroupLabel>Custom Apps</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/apps" />} isActive={pathname === "/apps"}>
                    <Grid2x2 />
                    <span>App Directory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ── Bottom nav ──────────────────────────────────────────── */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navBottom.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />} isActive={pathname === item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer / User ────────────────────────────────────────────── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="h-8 w-8 rounded-lg shrink-0">
                  <AvatarImage
                    src={avatarUrl}
                    alt={userName}
                    className="rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">{userName || "…"}</span>
                  {badge ? (
                    <span
                      className="truncate text-[10px] font-semibold"
                      style={{ color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  ) : (
                    <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                  )}
                </div>
                <ChevronUp className="ml-auto size-4 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
