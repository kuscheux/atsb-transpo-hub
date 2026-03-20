import { PublicLayout } from "@/components/union/public-layout"
import { Mail } from "lucide-react"

const officers = [
  { name: "James \"Jim\" Holloway", title: "Secretary-Treasurer", initials: "JH", bio: "30-year member, former over-the-road driver. Leads negotiations for the entertainment transportation division." },
  { name: "Marcus Webb", title: "President", initials: "MW", bio: "Elected 2019. Former sanitation steward. Focuses on organizing and political action." },
  { name: "Patricia \"Pat\" Ruiz", title: "Vice President", initials: "PR", bio: "10 years on the executive board. Oversees member grievances and arbitration." },
  { name: "Darnell Foster", title: "Recording Secretary", initials: "DF", bio: "Keeps minutes, maintains records, and coordinates communications for the local." },
  { name: "Angela Kim", title: "Business Agent — Entertainment", initials: "AK", bio: "Represents drivers across film and television production companies in the Atlanta area." },
  { name: "Robert \"Bob\" Tanner", title: "Business Agent — Freight", initials: "RT", bio: "Handles contracts and grievances for freight carriers and distribution centers." },
  { name: "Denise Carter", title: "Business Agent — Public Sector", initials: "DC", bio: "Represents sanitation, transit, and municipal workers under Local 728 agreements." },
  { name: "Tyrone Jackson", title: "Trustee", initials: "TJ", bio: "Oversees the local's financial records and ensures compliance with IBT regulations." },
]

const timeline = [
  { year: "1952", event: "Local 728 chartered by the International Brotherhood of Teamsters in Atlanta, GA. First members: city sanitation workers." },
  { year: "1967", event: "Landmark strike wins first comprehensive health benefits for over-the-road drivers in the Southeast region." },
  { year: "1978", event: "Expanded membership to include warehouse and distribution workers following the Teamsters' national organizing push." },
  { year: "1992", event: "First entertainment transportation contract signed with a major film production company operating in Georgia." },
  { year: "2008", event: "Grew to 3,000 members; opened current union hall on Lakewood Avenue." },
  { year: "2016", event: "Organized 400+ drivers on the growing Georgia film production boom. Membership surpasses 4,000 for the first time." },
  { year: "2024", event: "Negotiated average 11% wage increase across all active contracts amid rising cost of living in Atlanta metro." },
  { year: "2026", event: "Landmark entertainment CBA secures 12% increase, new safety language, and overtime protections for 340 drivers." },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <div className="py-16" style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>
            About Us
          </p>
          <h1 className="text-4xl font-black text-white">Local 728 Officers & History</h1>
          <p className="mt-2 text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            A union is only as strong as its leadership. Meet the people who fight for our members every day.
          </p>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-black text-white mb-8">Executive Board & Business Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {officers.map((o) => (
            <div
              key={o.name}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(201,168,76,0.12)" }}
            >
              {/* Avatar */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl font-black text-lg"
                style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
              >
                {o.initials}
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-snug">{o.name}</p>
                <p className="text-xs mt-0.5 font-semibold" style={{ color: "#C9A84C" }}>
                  {o.title}
                </p>
              </div>
              <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {o.bio}
              </p>
              <button
                className="flex items-center gap-1.5 text-xs mt-auto self-start"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <Mail className="h-3 w-3" />
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div
        className="py-16"
        style={{ backgroundColor: "#0d1f3c", borderTop: "1px solid rgba(201,168,76,0.08)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white mb-10 text-center">Our History</h2>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-16 top-0 bottom-0 w-px"
              style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
            />
            <div className="space-y-8">
              {timeline.map((t) => (
                <div key={t.year} className="flex gap-6 items-start">
                  <div
                    className="w-32 shrink-0 text-right font-black text-sm"
                    style={{ color: "#C9A84C" }}
                  >
                    {t.year}
                  </div>
                  <div
                    className="relative mt-1 shrink-0 h-3 w-3 rounded-full border-2"
                    style={{ backgroundColor: "#0d1f3c", borderColor: "#C9A84C" }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {t.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="py-16" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">✊</div>
          <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Teamsters Local 728 exists to improve the lives of workers and their families by organizing, bargaining,
            and representing them with integrity. We believe every worker deserves a living wage, safe working
            conditions, and the right to dignity on the job — and we will fight like hell to make sure they get it.
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
