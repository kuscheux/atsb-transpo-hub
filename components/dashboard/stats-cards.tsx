import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Truck, DollarSign, UserPlus } from "lucide-react"

const stats = [
  {
    title: "Active Drivers",
    value: "40",
    change: "+12.5%",
    desc: "Trending up this block",
    sub: "Union 728 — On production",
    icon: Truck,
    positive: true,
  },
  {
    title: "Vehicles on Lot",
    value: "63",
    change: "-20%",
    desc: "Day-play units returned",
    sub: "Acquisition needs attention",
    icon: Truck,
    positive: false,
  },
  {
    title: "Weekly Budget",
    value: "$68,500",
    change: "+12.5%",
    desc: "Strong crew retention",
    sub: "Engagement exceeds targets",
    icon: DollarSign,
    positive: true,
  },
  {
    title: "New Applications",
    value: "0",
    change: "+4.5%",
    desc: "Steady form submissions",
    sub: "Meets hiring projections",
    icon: UserPlus,
    positive: true,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <span className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? "text-green-500" : "text-red-500"}`}>
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium">
              {stat.desc}
              <TrendingUp className={`h-3 w-3 ${stat.positive ? "text-green-500" : "text-red-500"}`} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
