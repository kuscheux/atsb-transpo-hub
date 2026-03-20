import Link from "next/link"
import { PublicLayout } from "@/components/union/public-layout"
import { HeroStagger } from "@/components/union/hero-stagger"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertTriangle } from "lucide-react"

const stats = [
  { value: "4,200+", label: "Active Members" },
  { value: "23", label: "Active Contracts" },
  { value: "72", label: "Years Strong" },
  { value: "$38 / hr", label: "Avg. Wage Floor" },
]

const news = [
  {
    badge: "Contract Win",
    headline: "New CBA Secures 12% Wage Increase for Hollywood Division",
    date: "March 18, 2026",
    excerpt:
      "After 4 months of negotiation, Local 728 secured a landmark agreement covering 340 drivers in the entertainment transportation sector.",
  },
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
]

const benefits = [
  { icon: "💰", title: "Fair Wages", desc: "Negotiated contracts that keep pace with inflation and industry standards." },
  { icon: "🛡️", title: "Job Security", desc: "Protecting members from unjust termination and workplace retaliation." },
  { icon: "🏥", title: "Full Benefits", desc: "Health insurance, pension, and paid leave for every covered worker." },
  { icon: "⚖️", title: "Grievance Rights", desc: "Expert representation when your employer violates the contract." },
]

export default function HomePage() {
  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <HeroStagger />
      </section>

      {/* ── Stats bar ───────────────────────────────── */}
      <section style={{ backgroundColor: "#C9A84C" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black" style={{ color: "#0A1628" }}>
                  {s.value}
                </div>
                <div className="text-xs font-semibold tracking-wide mt-0.5" style={{ color: "rgba(10,22,40,0.6)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest News ─────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#0d1f3c" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-white">Latest News</h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                Updates from Local 728 leadership
              </p>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="gap-1.5 text-sm" style={{ color: "#C9A84C" }}>
                All News <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {news.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-6 flex flex-col transition-colors hover:border-[rgba(201,168,76,0.35)]"
                style={{ backgroundColor: "#0A1628", border: "1px solid rgba(201,168,76,0.12)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
                  >
                    {item.badge}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.33)" }}>
                    {item.date}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-2 flex-1">{item.headline}</h3>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.48)" }}>
                  {item.excerpt}
                </p>
                <button
                  className="text-xs font-semibold flex items-center gap-1.5 self-start"
                  style={{ color: "#C9A84C" }}
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Fight For ───────────────────────── */}
      <section
        className="py-20"
        style={{ backgroundColor: "#0A1628", borderTop: "1px solid rgba(201,168,76,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">What We Fight For</h2>
            <p className="text-sm max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.48)" }}>
              Every contract, grievance, and organizing drive is about one thing: dignity at work.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl p-7 text-center"
                style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.1)" }}
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-white font-bold mb-2">{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#C9A84C" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-widest mb-2 uppercase" style={{ color: "rgba(10,22,40,0.55)" }}>
            Become a Member
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "#0A1628" }}>
            Ready to Join Local 728?
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(10,22,40,0.65)" }}>
            Protect your job. Raise your wages. Stand with 4,200 Atlanta workers.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="font-bold gap-2 hover:opacity-90"
              style={{ backgroundColor: "#0A1628", color: "white" }}
            >
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
