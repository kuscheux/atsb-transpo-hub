import { NextResponse } from "next/server"
import path from "path"

const TRANSPO_KEYWORDS = ["transpo", "call sheet", "driver", "schedule", "pickup", "callsheet", "wrap", "calltime"]

export async function GET() {
  if (process.env.ENABLE_IMESSAGES !== "true") {
    return NextResponse.json(
      { error: "iMessage integration disabled. Set ENABLE_IMESSAGES=true in .env.local to enable." },
      { status: 501 }
    )
  }

  try {
    // Dynamic import to avoid bundling on production builds
    const Database = (await import("better-sqlite3")).default
    const dbPath = path.join(process.env.HOME ?? "~", "Library", "Messages", "chat.db")
    const db = new Database(dbPath, { readonly: true })

    const keywordFilter = TRANSPO_KEYWORDS.map((k) => `m.text LIKE '%${k}%'`).join(" OR ")

    const rows = db.prepare(`
      SELECT
        m.text,
        h.id as contact,
        datetime(m.date / 1000000000 + 978307200, 'unixepoch', 'localtime') as sent_at,
        m.is_from_me
      FROM message m
      JOIN handle h ON m.handle_id = h.rowid
      WHERE m.text IS NOT NULL
        AND (${keywordFilter})
        AND m.date > (strftime('%s', 'now') - 86400) * 1000000000
      ORDER BY m.date DESC
      LIMIT 50
    `).all()

    db.close()

    return NextResponse.json({ messages: rows })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    // Common errors: SQLITE_CANTOPEN (no Full Disk Access), file not found
    return NextResponse.json(
      {
        error: "Could not read iMessage database.",
        detail: msg,
        hint: "Grant Full Disk Access to your terminal in System Settings → Privacy & Security → Full Disk Access",
      },
      { status: 500 }
    )
  }
}
