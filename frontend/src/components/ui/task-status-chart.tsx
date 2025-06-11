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
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

type Props = {
  chartConfig: any
  completed: number
  approved: number
  pending: number
  inProgress: number
}

export function TaskStatusChart({
  chartConfig,
  completed,
  approved,
  pending,
  inProgress,
}: Props) {
  const colors = chartConfig.colors || {}

  const data = [
    { name: "Completed", value: completed, color: colors.completed || "blue" },
    { name: "In Progress", value: inProgress, color: colors.inProgress || "purple" },
    { name: "Pending", value: pending, color: colors.pending || "red" },
    { name: "Approved", value: approved, color: colors.approved || "green" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
        <CardDescription>Current breakdown of task statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full dark:text-zinc-50"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-zinc-50">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
