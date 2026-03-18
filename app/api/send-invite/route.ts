import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  try {
    const { id, phone, name, resend } = await request.json()

    const message = resend
      ? `🚛 ATSB Transpo reminder: ${name}, your start paperwork must be completed in Greenslate. NO paperwork = NO timecard = NO paycheck. Questions? Call Donny Thrift: (478) 387-6557`
      : `🎬 Welcome to ATSB Transportation, ${name}! You'll receive a Greenslate email to complete your start paperwork. NO paperwork = NO timecard. Questions? Call Donny: (478) 387-6557. Good luck on set! 🚛`

    const sid = process.env.TWILIO_ACCOUNT_SID
    const token = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_PHONE_NUMBER

    if (sid && token && from && sid !== "your_twilio_sid") {
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ From: from, To: phone, Body: message }),
        }
      )
    }

    await supabase
      .from("driver_applications")
      .update({ invite_sent: true, invite_sent_at: new Date().toISOString() })
      .eq("id", id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Send invite error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
