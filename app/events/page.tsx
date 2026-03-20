import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

const events = [
  {
    date: { month: "APR", day: "2" },
    title: "Q1 General Membership Meeting",
    type: "Meeting",
    time: "6:00 PM – 8:00 PM",
    location: "Union Hall — Main Assembly Room",
    address: "2540 Lakewood Ave SW, Atlanta, GA",
    desc: "Quarterly meeting for all active members. Agenda includes contract ratification vote, executive board elections update, and open floor Q&A.",
    rsvp: true,
    capacity: "Unlimited",
  },
  {
    date: { month: "APR", day: "12" },
    title: "CDL Safety & Refresher Training",
    type: "Training",
    time: "8:00 AM – 12:00 PM",
    location: "Union Hall — Training Room B",
    address: "2540 Lakewood Ave SW, Atlanta, GA",
    desc: "Free half-day training covering defensive driving, updated DOT HOS regulations, HazMat awareness, and fatigue management. Open to all members with a valid CDL.",
    rsvp: true,
    capacity: "35 seats",
  },
  {
    date: { month: "APR", day: "15" },
    title: "2026 Health Plan Open Enrollment Deadline",
    type: "Deadline",
    time: "11:59 PM",
    location: "Online via Member Portal or HR Office",
    address: null,
    desc: "Last day to make changes to your health insurance, dental, vision, or FSA elections for 2026. Contact the hall if you need assistance.",
    rsvp: false,
    capacity: null,
  },
  {
    date: { month: "APR", day: "24" },
    title: "Political Action & Organizing Committee Meeting",
    type: "Meeting",
    time: "5:30 PM – 7:00 PM",
    location: "Union Hall — Conference Room",
    address: "2540 Lakewood Ave SW, Atlanta, GA",
    desc: "Monthly PACE meeting to discuss legislative priorities, endorsed candidates, and upcoming organizing drives.",
    rsvp: false,
    capacity: null,
  },
  {
    date: { month: "MAY", day: "1" },
    title: "International Workers Day Rally",
    type: "Rally",
    time: "11:00 AM – 2:00 PM",
    location: "Woodruff Park, Downtown Atlanta",
    address: "Five Points, Atlanta, GA",
    desc: "Join Local 728 and Atlanta-area union brothers and sisters for International Workers Day. Bring your family. Community speakers, food, and solidarity.",
    rsvp: false,
    capacity: null,
  },
  {
    date: { month: "MAY", day: "14" },
    title: "New Member Orientation",
    type: "Orientation",
    time: "9:00 AM – 11:00 AM",
    location: "Union Hall — Training Room A",
    address: "2540 Lakewood Ave SW, Atlanta, GA",
    desc: "Mandatory orientation for all members who joined in Q1 2026. Covers dues, contract rights, grievance procedures, and available resources.",
    rsvp: true,
    capacity: "Unlimited",
  },
]

const typeColors: Record<string, string> = {
  Meeting: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Training: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Deadline: "bg-red-500/15 text-red-400 border-red-500/20",
  Rally: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Orientation: "bg-green-500/15 text-green-400 border-green-500/20",
}

export default function EventsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Events & Meetings</span>
        </header>

        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-3xl space-y-4">
            <div className="mb-2">
              <h1 className="text-xl font-bold mb-1">Upcoming Events</h1>
              <p className="text-sm text-muted-foreground">
                Meetings, trainings, rallies, and important deadlines for Local 728 members.
              </p>
            </div>

            {events.map((e) => (
              <div
                key={e.title}
                className="rounded-xl border border-border bg-card p-5 flex gap-4"
              >
                {/* Date badge */}
                <div
                  className="flex flex-col items-center justify-center h-14 w-14 rounded-xl shrink-0 text-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.12)" }}
                >
                  <span className="text-[10px] font-bold tracking-widest" style={{ color: "#C9A84C" }}>
                    {e.date.month}
                  </span>
                  <span className="text-2xl font-black leading-none" style={{ color: "#C9A84C" }}>
                    {e.date.day}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{e.title}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[e.type]}`}>
                          {e.type}
                        </span>
                      </div>
                    </div>
                    {e.rsvp && (
                      <Button size="sm" className="h-7 text-xs shrink-0">
                        RSVP
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {e.location}
                    </span>
                    {e.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {e.capacity}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
