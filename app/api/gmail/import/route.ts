import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, data } = body as {
    type: string
    data: Record<string, string | null>
  }

  if (type === 'driver_application') {
    if (!data.driver_name) {
      return NextResponse.json({ error: 'driver_name is required' }, { status: 400 })
    }

    const { error } = await supabase.from('driver_applications').insert({
      driver_name: data.driver_name,
      phone_number: data.phone_number || '',
      email: data.email || '',
      last_5_ssn: '',
      hired_to_drive: data.hired_to_drive || '',
      acknowledged_work_times: false,
      acknowledged_vehicle_swap: false,
      acknowledged_timecard: false,
      status: 'pending',
      notes: [
        data.rate ? `Rate: ${data.rate}` : null,
        data.vehicle ? `Vehicle: ${data.vehicle}` : null,
        data.notes,
        data.summary ? `(Imported from email: ${data.summary})` : null,
      ]
        .filter(Boolean)
        .join('\n') || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else if (type === 'calendar_event') {
    const eventDate = data.shoot_date || new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('calendar_events').insert({
      title: data.event_title || data.summary || 'Imported Event',
      event_date: eventDate,
      event_type: 'shoot',
      notes: [
        data.call_time ? `Call time: ${data.call_time}` : null,
        data.location ? `Location: ${data.location}` : null,
        data.po_number ? `PO: ${data.po_number}` : null,
        data.notes,
      ]
        .filter(Boolean)
        .join('\n') || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: `Unknown import type: ${type}` }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
