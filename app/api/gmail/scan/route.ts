import { google } from 'googleapis'
import Anthropic from '@anthropic-ai/sdk'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function getOAuthClient(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return oauth2Client
}

function extractBodyText(part: {
  mimeType?: string
  body?: { data?: string }
  parts?: unknown[]
}): string {
  if (part.mimeType === 'text/plain' && part.body?.data) {
    return Buffer.from(part.body.data, 'base64').toString('utf-8')
  }
  if (part.parts) {
    return (part.parts as typeof part[]).map(extractBodyText).join('\n')
  }
  return ''
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('gmail_access_token')?.value
  const refreshToken = cookieStore.get('gmail_refresh_token')?.value

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const query = request.nextUrl.searchParams.get('q') ||
    'subject:(call sheet OR driver OR transport OR vehicle OR hire OR crew OR pickup) newer_than:30d'

  try {
    const oauth2Client = getOAuthClient(accessToken || '', refreshToken || '')
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      q: query,
    })

    const messages = data.messages || []
    const results = []

    for (const msg of messages.slice(0, 15)) {
      const { data: msgData } = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'full',
      })

      const headers = msgData.payload?.headers || []
      const subject = headers.find((h) => h.name === 'Subject')?.value || '(no subject)'
      const from = headers.find((h) => h.name === 'From')?.value || ''
      const date = headers.find((h) => h.name === 'Date')?.value || ''

      const bodyText = extractBodyText(
        msgData.payload as Parameters<typeof extractBodyText>[0],
      )

      let extracted: Record<string, unknown> = {
        type: 'other',
        confidence: 'low',
        summary: subject,
      }

      if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key') {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: `You are a transportation coordinator assistant. Extract structured data from this email for a film/TV production transportation department. Return ONLY valid JSON.

Email:
Subject: ${subject}
From: ${from}
Date: ${date}
Body:
${bodyText.slice(0, 4000)}

Return this exact JSON structure (use null for any missing fields):
{
  "type": "driver_application" | "call_sheet" | "calendar_event" | "other",
  "driver_name": "full name or null",
  "phone_number": "phone or null",
  "email": "email address or null",
  "hired_to_drive": "vehicle type/assignment or null",
  "rate": "pay rate (e.g. $28/hr) or null",
  "vehicle": "vehicle description or null",
  "shoot_date": "YYYY-MM-DD or null",
  "call_time": "time string or null",
  "location": "address or location or null",
  "po_number": "PO # or null",
  "event_title": "event/shoot name or null",
  "notes": "any other relevant info or null",
  "confidence": "high" | "medium" | "low",
  "summary": "one sentence summary of what this email is about"
}`,
              },
            ],
          })

          const text = response.content[0].type === 'text' ? response.content[0].text : ''
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            extracted = JSON.parse(jsonMatch[0])
          }
        } catch {
          // Keep default extracted value on parse error
        }
      }

      results.push({
        id: msg.id,
        subject,
        from,
        date,
        snippet: msgData.snippet || '',
        extracted,
      })
    }

    return NextResponse.json({ emails: results })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
