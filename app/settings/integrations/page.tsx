"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, ExternalLink, AlertTriangle } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Settings · Integrations</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-2xl space-y-5">
            <div>
              <h1 className="text-xl font-bold mb-1">Connected Apps</h1>
              <p className="text-sm text-muted-foreground">
                Connect external services to surface relevant information in the AI Assistant and your dashboard.
              </p>
            </div>

            {/* Gmail */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Gmail</CardTitle>
                      <CardDescription className="text-xs">Read transpo-relevant emails in the AI Assistant</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Not connected</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Setup required in Google Cloud Console</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Enable the Gmail API on your OAuth project</li>
                    <li>Add <code className="bg-muted px-1 py-0.5 rounded text-foreground">https://www.googleapis.com/auth/gmail.readonly</code> scope to your OAuth consent screen</li>
                    <li>Add <code className="bg-muted px-1 py-0.5 rounded text-foreground">/api/integrations/gmail/callback</code> as an authorized redirect URI</li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground">
                  Once connected, the AI Assistant can read emails matching: <span className="text-foreground font-medium">transpo, call, wrap, driver, schedule, pickup</span>
                </p>
                <Button size="sm" className="gap-2" disabled>
                  <Mail className="h-4 w-4" />
                  Connect Gmail
                  <span className="text-[10px] opacity-60">(coming soon)</span>
                </Button>
              </CardContent>
            </Card>

            {/* iMessage */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">iMessage</CardTitle>
                      <CardDescription className="text-xs">Read local iMessage texts in the AI Assistant</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Local only</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Local development only.</span> This feature reads from your Mac&apos;s Messages database. It will not work in production deployments.
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To enable</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open <strong className="text-foreground">System Settings → Privacy &amp; Security → Full Disk Access</strong></li>
                    <li>Grant access to your Terminal (or iTerm2)</li>
                    <li>Add <code className="bg-muted px-1 py-0.5 rounded text-foreground">ENABLE_IMESSAGES=true</code> to your <code className="bg-muted px-1 py-0.5 rounded text-foreground">.env.local</code></li>
                    <li>Restart the dev server</li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground">
                  Filters messages containing: <span className="text-foreground font-medium">transpo, call sheet, driver, schedule</span>
                </p>
                <a
                  href="x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Privacy Settings
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
