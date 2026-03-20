import Link from "next/link"

export function PublicFooter() {
  return (
    <footer
      className="py-14"
      style={{ backgroundColor: "#060e1c", borderTop: "1px solid rgba(201,168,76,0.12)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg font-black text-lg select-none"
                style={{ backgroundColor: "#C9A84C", color: "#0A1628" }}
              >
                ✊
              </div>
              <div>
                <div className="text-white font-black text-sm tracking-widest">TEAMSTERS LOCAL 728</div>
                <div className="text-xs tracking-widest" style={{ color: "#C9A84C" }}>
                  ATLANTA, GEORGIA
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Fighting for fair wages, safe working conditions, and dignity on the job since 1952.
              Affiliated with the International Brotherhood of Teamsters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Member Resources</h4>
            <div className="space-y-2.5">
              {[
                { label: "Pay Dues Online", href: "/members/dues" },
                { label: "Job Dispatch Board", href: "/members/dispatch" },
                { label: "File a Grievance", href: "/grievances" },
                { label: "Active Contracts", href: "/contracts" },
                { label: "Events & Meetings", href: "/events" },
                { label: "Register as Member", href: "/register" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Office</h4>
            <div className="space-y-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <p>2540 Lakewood Ave SW</p>
              <p>Atlanta, GA 30315</p>
              <p className="pt-2 font-mono">(404) 622-1728</p>
              <p>info@teamsterslocal728.org</p>
              <p className="pt-2">Mon – Fri: 8:00 am – 5:00 pm</p>
              <p>Sat – Sun: Closed</p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Teamsters Local 728. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Use", "Accessibility"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-xs transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
