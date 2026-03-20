import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

const TRANSPO_QUERY =
  "subject:transpo OR subject:call OR subject:wrap OR subject:driver OR subject:schedule OR subject:pickup OR subject:callsheet"

async function refreshIfNeeded(integration: {
  access_token: string | null
  refresh_token: string | null
  expires_at: string | null
}) {
  if (!integration.expires_at) return integration.access_token

  const expiresAt = new Date(integration.expires_at).getTime()
  if (Date.now() < expiresAt - 5 * 60 * 1000) return integration.access_token

  if (!integration.refresh_token) return integration.access_token

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: integration.refresh_token,
      client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      grant_type:    "refresh_token",
    }),
  })

  const tokens = await res.json()
  return tokens.access_token as string
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: integration } = await supabase
    .from("user_integrations")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", user.id)
    .eq("provider", "gmail")
    .single()

  if (!integration) {
    return NextResponse.json({ error: "Gmail not connected" }, { status: 404 })
  }

  const token = await refreshIfNeeded(integration)
  if (!token) return NextResponse.json({ error: "No valid token" }, { status: 401 })

  // Fetch message list
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(TRANSPO_QUERY)}&maxResults=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const listData = await listRes.json()
  const ids: string[] = (listData.messages ?? []).map((m: { id: string }) => m.id)

  // Fetch each message's metadata
  const emails = await Promise.all(
    ids.slice(0, 10).map(async (id) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const msg = await msgRes.json()
      const headers = (msg.payload?.headers ?? []) as { name: string; value: string }[]
      const get = (name: string) => headers.find((h) => h.name === name)?.value ?? ""
      return {
        id,
        from:    get("From"),
        subject: get("Subject"),
        date:    get("Date"),
        snippet: msg.snippet ?? "",
      }
    })
  )

  return NextResponse.json({ emails })
}
