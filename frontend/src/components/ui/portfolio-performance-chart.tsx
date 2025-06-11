"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { portfolio: "Tech Growth", performance: 12.5, target: 10 },
  { portfolio: "Healthcare", performance: 8.3, target: 8 },
  { portfolio: "Energy", performance: 15.2, target: 12 },
  { portfolio: "Real Estate", performance: 6.8, target: 7 },
  { portfolio: "Bonds", performance: 4.2, target: 4.5 },
  { portfolio: "International", performance: 9.7, target: 9 },
]

const chartConfig = {
  performance: {
    label: "Actual Performance (%)",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Performance (%)",
    color: "hsl(var(--chart-2))",
  },
}

export function PortfolioPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Actual vs target performance by portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="portfolio"
                tickLine={false}
                axisLine={false}
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="performance" fill="var(--color-performance)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
