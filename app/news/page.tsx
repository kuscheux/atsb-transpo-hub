import { PublicLayout } from "@/components/union/public-layout"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const featured = {
  badge: "Contract Win",
  headline: "New CBA Secures 12% Wage Increase for Hollywood Division",
  date: "March 18, 2026",
  body: "After four months of intense negotiation, Local 728 reached a landmark collective bargaining agreement with three major production studios, covering approximately 340 entertainment transportation drivers in the Atlanta metro area. The agreement includes a 12% wage increase over three years, improved overtime provisions, and new safety language governing 16-hour production days.",
}

const articles = [
  {
    badge: "Meeting",
    headline: "Q1 General Membership Meeting — April 2nd @ Union Hall",
    date: "March 15, 2026",
    excerpt:
      "All members are encouraged to attend. Agenda includes contract ratification vote and executive board election updates.",
  },
  {
    badge: "Safety",
    headline: "Updated Hours-of-Service Policy Takes Effect April 1",
    date: "March 12, 2026",
    excerpt:
      "All commercial drivers covered under Local 728 agreements must adhere to updated HOS regulations starting April 1st.",
  },
  {
    badge: "Organizing",
    headline: "Warehouse Workers at Peachtree Distribution Vote to Join Local 728",
    date: "March 8, 2026",
    excerpt:
      "78 workers at the Peachtree Distribution Center voted 61–17 to join Local 728 in a landmark organizing campaign.",
  },
  {
    badge: "Benefits",
    headline: "2026 Health Plan Open Enrollment Begins April 15",
    date: "March 5, 2026",
    excerpt:
      "Members will receive enrollment packets by mail. Log into the Member Portal to review your current coverage and update beneficiaries.",
  },
  {
    badge: "Training",
    headline: "CDL Refresher & Safety Training — April 12 Registration Open",
    date: "February 28, 2026",
    excerpt:
      "Free half-day training for all active members. Covers defensive driving, HazMat awareness, and updated DOT regs.",
  },
  {
    badge: "Contract Win",
    headline: "Sanitation Workers Ratify New 3-Year Agreement",
    date: "February 20, 2026",
    excerpt:
      "Members voted 94% in favor of the new contract, which includes an 8% first-year wage increase and Martin Luther King Day as a paid holiday.",
  },
]

const badgeColors: Record<string, string> = {
  "Contract Win": "rgba(34,197,94,0.15)",
  Meeting: "rgba(59,130,246,0.15)",
  Safety: "rgba(239,68,68,0.15)",
  Organizing: "rgba(168,85,247,0.15)",
  Benefits: "rgba(249,115,22,0.15)",
  Training: "rgba(20,184,166,0.15)",
}
const badgeText: Record<string, string> = {
  "Contract Win": "#4ade80",
  Meeting: "#60a5fa",
  Safety: "#f87171",
  Organizing: "#c084fc",
  Benefits: "#fb923c",
  Training: "#2dd4bf",
}

export default function NewsPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <div
        className="py-16"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>
            Local 728
          </p>
          <h1 className="text-4xl font-black text-white">News & Announcements</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Updates on contracts, meetings, organizing, and member benefits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured */}
        <div
          className="rounded-2xl p-8 mb-10"
          style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(201,168,76,0.18)", color: "#C9A84C" }}
            >
              📌 Pinned · {featured.badge}
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {featured.date}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3 max-w-2xl">{featured.headline}</h2>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "rgba(255,255,255,0.6)" }}>
            {featured.body}
          </p>
          <button className="mt-5 text-xs font-semibold flex items-center gap-1.5" style={{ color: "#C9A84C" }}>
            Read Full Story <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col hover:border-[rgba(201,168,76,0.3)] transition-colors"
              style={{ backgroundColor: "#0A1628", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: badgeColors[item.badge] ?? "rgba(201,168,76,0.12)",
                    color: badgeText[item.badge] ?? "#C9A84C",
                  }}
                >
                  {item.badge}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {item.date}
                </span>
              </div>
              <h3 className="text-white font-bold text-sm leading-snug mb-2 flex-1">{item.headline}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.48)" }}>
                {item.excerpt}
              </p>
              <button className="text-xs font-semibold flex items-center gap-1 self-start" style={{ color: "#C9A84C" }}>
                Read More <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
