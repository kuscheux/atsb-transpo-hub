"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FBXPlayer } from "@/components/animations/fbx-player"
import { Loader2 } from "lucide-react"

type Animation = {
  name: string
  slug: string
  url:  string
  size?: number
}

export default function AnimationsPage() {
  const [animations, setAnimations] = useState<Animation[]>([])
  const [active, setActive]         = useState<Animation | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    fetch("/api/animations")
      .then((r) => r.json())
      .then((d) => {
        setAnimations(d.animations ?? [])
        if (d.animations?.length > 0) setActive(d.animations[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Animations</span>
          <Badge variant="outline" className="text-[10px] ml-1">Mixamo</Badge>
        </header>

        <main className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading animations from Supabase…</span>
            </div>
          ) : animations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
              <p className="text-sm font-medium">No animations yet</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Download FBX files from{" "}
                <a href="https://mixamo.com" target="_blank" rel="noopener noreferrer" className="underline">
                  mixamo.com
                </a>{" "}
                to ~/Downloads, then run:
              </p>
              <code className="text-xs bg-muted rounded px-3 py-1.5">
                node scripts/upload-animations.mjs
              </code>
            </div>
          ) : (
            <div className="flex gap-5 items-start max-w-5xl">
              {/* Player */}
              <div className="flex-1 min-w-0">
                {active && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-base font-semibold">{active.name}</h2>
                      <Badge variant="outline" className="text-[10px]">{active.slug}</Badge>
                    </div>
                    <FBXPlayer url={active.url} height={480} autoRotate />
                  </>
                )}
              </div>

              {/* Sidebar: animation list */}
              <div className="w-52 shrink-0 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Library ({animations.length})
                </p>
                {animations.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => setActive(a)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      active?.slug === a.slug
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:bg-accent text-foreground"
                    }`}
                  >
                    {a.name}
                    {a.size && (
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        {(a.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
