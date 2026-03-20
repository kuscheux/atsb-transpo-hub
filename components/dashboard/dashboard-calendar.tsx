"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { supabase } from "@/lib/supabase"

type CalendarEvent = {
  id: string
  title: string
  event_date: string
  event_type: "shoot" | "travel" | "fitting" | "meeting" | "other"
}

const typeColors: Record<CalendarEvent["event_type"], string> = {
  shoot: "bg-blue-500",
  travel: "bg-orange-500",
  fitting: "bg-purple-500",
  meeting: "bg-green-500",
  other: "bg-muted-foreground",
}

const typeLabels: Record<CalendarEvent["event_type"], string> = {
  shoot: "Shoot",
  travel: "Travel",
  fitting: "Fitting",
  meeting: "Meeting",
  other: "Other",
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function DashboardCalendar() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr)

  useEffect(() => {
    fetchEvents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  async function fetchEvents() {
    const year = current.getFullYear()
    const month = current.getMonth()
    const start = new Date(year, month, 1).toISOString().slice(0, 10)
    const end = new Date(year, month + 1, 0).toISOString().slice(0, 10)
    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("event_date", start)
      .lte("event_date", end)
      .order("event_date")
    if (data) setEvents(data as CalendarEvent[])
  }

  const year = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const monthName = current.toLocaleString("default", { month: "long", year: "numeric" })

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const eventsByDate: Record<string, CalendarEvent[]> = {}
  for (const e of events) {
    if (!eventsByDate[e.event_date]) eventsByDate[e.event_date] = []
    eventsByDate[e.event_date].push(e)
  }

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : []

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4" />
          Production Calendar
          <Badge variant="outline" className="ml-auto text-xs font-normal text-green-500 border-green-500/30">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">{monthName}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const dayEvents = eventsByDate[dateStr] ?? []

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`
                  relative flex flex-col items-center rounded-md py-1 text-xs font-medium transition-colors
                  ${isToday ? "bg-primary text-primary-foreground" : ""}
                  ${isSelected && !isToday ? "bg-muted ring-1 ring-border" : ""}
                  ${!isToday && !isSelected ? "hover:bg-muted/60" : ""}
                `}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span key={e.id} className={`h-1 w-1 rounded-full ${typeColors[e.event_type]}`} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day events */}
        {selectedDate && (
          <div className="border-t pt-3 space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("default", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">No events scheduled.</p>
            ) : (
              selectedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${typeColors[e.event_type]}`} />
                  <span className="text-xs flex-1 truncate">{e.title}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
                    {typeLabels[e.event_type]}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
