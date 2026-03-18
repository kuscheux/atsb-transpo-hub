"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { onboardingActivity } from "@/lib/call-sheet-data"

const ranges = {
  "Last 3 months": onboardingActivity,
  "Last 30 days": onboardingActivity.slice(-6),
  "Last 7 days": onboardingActivity.slice(-3),
}

type RangeKey = keyof typeof ranges

export function OnboardingChart() {
  const [range, setRange] = useState<RangeKey>("Last 3 months")
  const data = ranges[range]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Driver Onboarding</CardTitle>
          <CardDescription>Total cumulative drivers — {range.toLowerCase()}</CardDescription>
        </div>
        <div className="flex gap-1">
          {(Object.keys(ranges) as RangeKey[]).map((key) => (
            <Button
              key={key}
              variant={range === key ? "default" : "outline"}
              size="sm"
              onClick={() => setRange(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="driverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e4e4e7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e4e4e7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fafafa",
                fontSize: 12,
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Area
              type="monotone"
              dataKey="drivers"
              name="Drivers"
              stroke="#e4e4e7"
              strokeWidth={2}
              fill="url(#driverGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#e4e4e7" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
