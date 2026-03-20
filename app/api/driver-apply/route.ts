import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from("driver_applications")
      .insert({
        driver_name: body.driver_name,
        phone_number: body.phone_number,
        email: body.email,
        last_5_ssn: body.last_5_ssn,
        hired_to_drive: body.hired_to_drive || null,
        acknowledged_work_times: body.acknowledged_work_times,
        acknowledged_vehicle_swap: body.acknowledged_vehicle_swap,
        acknowledged_timecard: body.acknowledged_timecard,
        license_front_url: body.license_front_url || null,
        license_back_url: body.license_back_url || null,
        status: "pending",
        invite_sent: false,
      })
      .select()
      .single()

    if (error) throw error

    // Auto-notify coordinator via text (if Twilio configured)
    await notifyCoordinator(body.driver_name, body.phone_number)

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("Application error:", err)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}

async function notifyCoordinator(driverName: string, driverPhone: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER
  const coordinatorPhone = process.env.COORDINATOR_PHONE || "+14783876557"

  if (!sid || !token || !from || sid === "your_twilio_sid") return

  const message = `🚛 NEW HIRE FORM: ${driverName} (${driverPhone}) just submitted an application. Review at your dashboard.`

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: coordinatorPhone, Body: message }),
    }
  )
}
