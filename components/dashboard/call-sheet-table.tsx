"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { callSheetData, type CallSheetEntry } from "@/lib/call-sheet-data"
import { Settings2, Plus } from "lucide-react"

const sections = [
  { key: "ON_PRODUCTION", label: "On Production" },
  { key: "OFF_PRODUCTION", label: "Off Production" },
  { key: "EO_EQUIPMENT", label: "E.O. Equipment" },
] as const

type SectionKey = (typeof sections)[number]["key"]

function getSectionBadge(section: CallSheetEntry["section"]) {
  const map: Record<CallSheetEntry["section"], { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    ON_PRODUCTION: { label: "On Production", variant: "default" },
    OFF_PRODUCTION: { label: "Off Production", variant: "secondary" },
    EO_EQUIPMENT: { label: "E.O. Equipment", variant: "outline" },
    CONDORS_LIFTS: { label: "Condors & Lifts", variant: "outline" },
    SERVICES: { label: "Services", variant: "outline" },
    SELF_DRIVE: { label: "Self Drive", variant: "outline" },
  }
  const { label, variant } = map[section]
  return <Badge variant={variant}>{label}</Badge>
}

export function CallSheetTable() {
  const [activeSection, setActiveSection] = useState<SectionKey>("ON_PRODUCTION")
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const filtered = callSheetData.filter((e) => e.section === activeSection)

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            ATSB Call Sheet
            <Badge variant="outline" className="text-xs font-normal">
              All The Sinners Bleed
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings2 className="h-3.5 w-3.5" />
              Customize Columns
            </Button>
            <Button size="sm" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Entry
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 border-b border-border pt-2">
          {sections.map((s) => {
            const count = callSheetData.filter((e) => e.section === s.key).length
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === s.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
                <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-xs">
                  {count}
                </Badge>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox />
              </TableHead>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Unit #</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>Wrap</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>P.O.</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow
                key={entry.id}
                className={selected.has(entry.id) ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(entry.id)}
                    onCheckedChange={() => toggleSelect(entry.id)}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{entry.id}</TableCell>
                <TableCell className="font-medium">{entry.name || "—"}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{entry.unitNumber || "—"}</TableCell>
                <TableCell>{entry.equipment}</TableCell>
                <TableCell className="text-xs">{entry.start || "—"}</TableCell>
                <TableCell className="text-xs">{entry.wrap || "—"}</TableCell>
                <TableCell className="text-xs font-medium text-green-500">{entry.rate || "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{entry.po || "—"}</TableCell>
                <TableCell>
                  <Badge variant={entry.vendor === "B.I." ? "secondary" : "outline"} className="text-xs">
                    {entry.vendor || "—"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {entry.notes || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
