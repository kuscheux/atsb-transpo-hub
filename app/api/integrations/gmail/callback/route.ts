import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(req: NextRequest) {
  const code        = req.nextUrl.searchParams.get("code")
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/integrations/gmail/callback`

  if (!code) {
    return NextResponse.redirect(new URL("/settings/integrations?error=no_code", req.url))
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirect_uri:  redirectUri,
      grant_type:    "authorization_code",
    }),
  })

  const tokens = await tokenRes.json()
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/settings/integrations?error=token_exchange", req.url))
  }

  // Store tokens for current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  await supabase.from("user_integrations").upsert({
    user_id:       user.id,
    provider:      "gmail",
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at:    expiresAt,
  })

  return NextResponse.redirect(new URL("/settings/integrations?connected=gmail", req.url))
}
