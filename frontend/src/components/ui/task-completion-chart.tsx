"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", completed: 65, assigned: 80 },
  { month: "Feb", completed: 78, assigned: 95 },
  { month: "Mar", completed: 82, assigned: 100 },
  { month: "Apr", completed: 95, assigned: 110 },
  { month: "May", completed: 88, assigned: 105 },
  { month: "Jun", completed: 102, assigned: 120 },
  { month: "Jul", completed: 115, assigned: 130 },
]

const chartConfig = {
  completed: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-1))",
  },
  assigned: {
    label: "Assigned Tasks",
    color: "hsl(var(--chart-2))",
  },
}

export function TaskCompletionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trends</CardTitle>
        <CardDescription>Monthly comparison of assigned vs completed tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-completed)"
                strokeWidth={2}
                dot={{ fill: "var(--color-completed)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="assigned"
                stroke="var(--color-assigned)"
                strokeWidth={2}
                dot={{ fill: "var(--color-assigned)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
