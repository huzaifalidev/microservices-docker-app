"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

export function TasksByDayChart() {
  const data = [
    { day: "Mon", tasks: 2 },
    { day: "Tue", tasks: 10 },
    { day: "Wed", tasks: 14 },
    { day: "Thu", tasks: 4 },
    { day: "Fri", tasks: 15 },
    { day: "Sat", tasks: 24 },
    { day: "Sun", tasks: 10 },
  ]

  const chartConfig = {
    tasks: {
      label: "Tasks Created : ",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks Created by Day</CardTitle>
        <CardDescription>Daily trend of created tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="var(--color-tasks)"
                fillOpacity={1}
                fill="url(#colorTasks)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
