'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Mail,
  ScanSearch,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ExtractedData = {
  type: 'driver_application' | 'call_sheet' | 'calendar_event' | 'other'
  driver_name: string | null
  phone_number: string | null
  email: string | null
  hired_to_drive: string | null
  rate: string | null
  vehicle: string | null
  shoot_date: string | null
  call_time: string | null
  location: string | null
  po_number: string | null
  event_title: string | null
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
  summary: string
}

type EmailResult = {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
  extracted: ExtractedData
  importStatus?: 'idle' | 'importing' | 'imported' | 'error'
}

const TYPE_LABELS: Record<ExtractedData['type'], { label: string; icon: React.ElementType; color: string }> = {
  driver_application: { label: 'Driver Application', icon: User, color: 'text-blue-400' },
  call_sheet: { label: 'Call Sheet', icon: FileText, color: 'text-yellow-400' },
  calendar_event: { label: 'Calendar Event', icon: Calendar, color: 'text-green-400' },
  other: { label: 'Other', icon: Mail, color: 'text-muted-foreground' },
}

const CONFIDENCE_STYLES: Record<ExtractedData['confidence'], string> = {
  high: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

function EmailCard({
  email,
  onImport,
}: {
  email: EmailResult
  onImport: (email: EmailResult, type: 'driver_application' | 'calendar_event') => void
}) {
  const [expanded, setExpanded] = useState(false)
  const { extracted } = email
  const typeInfo = TYPE_LABELS[extracted.type]
  const TypeIcon = typeInfo.icon
  const importable = extracted.type === 'driver_application' || extracted.type === 'calendar_event'

  const importType = extracted.type === 'driver_application' ? 'driver_application' : 'calendar_event'

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card transition-all',
        email.importStatus === 'imported' && 'opacity-60',
      )}
    >
      {/* Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className={cn('mt-0.5 shrink-0', typeInfo.color)}>
          <TypeIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate max-w-sm">{email.subject}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border font-medium',
                CONFIDENCE_STYLES[extracted.confidence],
              )}
            >
              {extracted.confidence} confidence
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground truncate">{email.from}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground shrink-0">{email.date}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{extracted.summary}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {email.importStatus === 'imported' && (
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Imported</span>
            </div>
          )}
          {email.importStatus === 'error' && (
            <div className="flex items-center gap-1 text-red-400 text-xs">
              <XCircle className="h-3.5 w-3.5" />
              <span>Failed</span>
            </div>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <Field label="Type" value={typeInfo.label} />
            <Field label="Driver / Contact" value={extracted.driver_name} />
            <Field label="Phone" value={extracted.phone_number} />
            <Field label="Email" value={extracted.email} />
            <Field label="Vehicle / Role" value={extracted.hired_to_drive || extracted.vehicle} />
            <Field label="Rate" value={extracted.rate} />
            <Field label="Shoot Date" value={extracted.shoot_date} />
            <Field label="Call Time" value={extracted.call_time} />
            <Field label="Location" value={extracted.location} />
            <Field label="PO Number" value={extracted.po_number} />
            <Field label="Event" value={extracted.event_title} />
          </div>

          {extracted.notes && (
            <div className="mt-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes</span>
              <p className="text-sm mt-0.5 text-muted-foreground">{extracted.notes}</p>
            </div>
          )}

          {/* Snippet */}
          <details className="mt-3">
            <summary className="text-[10px] uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
              Raw snippet
            </summary>
            <p className="text-xs text-muted-foreground mt-1 font-mono whitespace-pre-wrap">{email.snippet}</p>
          </details>

          {/* Import button */}
          {importable && email.importStatus !== 'imported' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onImport(email, importType as 'driver_application' | 'calendar_event')}
                disabled={email.importStatus === 'importing'}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {email.importStatus === 'importing' ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3" />
                    Import as {importType === 'driver_application' ? 'Driver Application' : 'Calendar Event'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function EmailImporter() {
  const searchParams = useSearchParams()
  const connected = searchParams.get('connected') === 'true'
  const oauthError = searchParams.get('error')

  const [isConnected, setIsConnected] = useState(connected)
  const [isScanning, setIsScanning] = useState(false)
  const [emails, setEmails] = useState<EmailResult[]>([])
  const [scanError, setScanError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (connected) setIsConnected(true)
  }, [connected])

  async function scan() {
    setIsScanning(true)
    setScanError(null)
    try {
      const qs = query ? `?q=${encodeURIComponent(query)}` : ''
      const res = await fetch(`/api/gmail/scan${qs}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'not_authenticated') {
          setIsConnected(false)
        }
        throw new Error(data.error || 'Scan failed')
      }
      setEmails((data.emails as EmailResult[]).map((e) => ({ ...e, importStatus: 'idle' as const })))
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsScanning(false)
    }
  }

  async function handleImport(
    email: EmailResult,
    type: 'driver_application' | 'calendar_event',
  ) {
    setEmails((prev) =>
      prev.map((e) => (e.id === email.id ? { ...e, importStatus: 'importing' } : e)),
    )

    try {
      const res = await fetch('/api/gmail/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: email.extracted }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')

      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, importStatus: 'imported' } : e)),
      )
    } catch {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, importStatus: 'error' } : e)),
      )
    }
  }

  const importableCount = emails.filter(
    (e) => e.extracted.type !== 'other' && e.importStatus !== 'imported',
  ).length

  const importedCount = emails.filter((e) => e.importStatus === 'imported').length

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold">Gmail Email Import</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your Gmail account and let AI scan emails to extract driver info, call sheet data, and
          events — then import directly into the dashboard.
        </p>
      </div>

      {/* OAuth error */}
      {oauthError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {oauthError === 'oauth_denied' && 'Google sign-in was cancelled.'}
            {oauthError === 'token_exchange_failed' && 'Failed to exchange authorization code.'}
            {oauthError !== 'oauth_denied' && oauthError !== 'token_exchange_failed' && `Error: ${oauthError}`}
          </span>
        </div>
      )}

      {/* Connection card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                isConnected ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground',
              )}
            >
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isConnected ? 'Gmail Connected' : 'Connect Gmail'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected
                  ? 'Read-only access granted. Emails are never modified.'
                  : 'Grant read-only access to scan relevant emails.'}
              </p>
            </div>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-1.5 text-green-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Connected</span>
            </div>
          ) : (
            <a
              href="/api/gmail/auth"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mail className="h-3.5 w-3.5" />
              Connect Gmail
            </a>
          )}
        </div>

        {/* Setup notice */}
        <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-400/90 space-y-1">
          <p className="font-medium">Setup required before connecting:</p>
          <ol className="list-decimal ml-4 space-y-0.5 text-yellow-400/70">
            <li>Go to <span className="font-mono">console.cloud.google.com</span> → Create project → Enable Gmail API</li>
            <li>Create OAuth 2.0 credentials (Web App) → Add <span className="font-mono">http://localhost:3000/api/gmail/callback</span> as redirect URI</li>
            <li>Add <span className="font-mono">GOOGLE_CLIENT_ID</span> and <span className="font-mono">GOOGLE_CLIENT_SECRET</span> to <span className="font-mono">.env.local</span></li>
            <li>Get your Anthropic API key at <span className="font-mono">console.anthropic.com</span> → add as <span className="font-mono">ANTHROPIC_API_KEY</span></li>
            <li>Restart dev server</li>
          </ol>
        </div>
      </div>

      {/* Scan controls */}
      {isConnected && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1.5 block">Search filter (optional)</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. from:dispatcher@studio.com OR subject:call sheet"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={scan}
              disabled={isScanning}
              className="mt-5 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <ScanSearch className="h-3.5 w-3.5" />
                  Scan Emails
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Scans up to 15 recent emails. Claude AI extracts driver names, rates, dates, vehicles, PO numbers, and more.
          </p>
        </div>
      )}

      {/* Error */}
      {scanError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <XCircle className="h-4 w-4 shrink-0" />
          {scanError}
        </div>
      )}

      {/* Results */}
      {emails.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {emails.length} emails found
              {importableCount > 0 && (
                <span className="ml-2 text-muted-foreground font-normal">
                  · {importableCount} importable
                </span>
              )}
              {importedCount > 0 && (
                <span className="ml-2 text-green-400 font-normal">
                  · {importedCount} imported
                </span>
              )}
            </h3>
            <span className="text-xs text-muted-foreground">Click to expand</span>
          </div>

          <div className="space-y-2">
            {emails.map((email) => (
              <EmailCard key={email.id} email={email} onImport={handleImport} />
            ))}
          </div>
        </div>
      )}

      {emails.length === 0 && !isScanning && isConnected && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ScanSearch className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Click <strong>Scan Emails</strong> to search your Gmail for transportation-related emails.
          </p>
        </div>
      )}

      {!isConnected && !oauthError && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Mail className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            Connect your Gmail account above to get started.
          </p>
        </div>
      )}
    </div>
  )
}
