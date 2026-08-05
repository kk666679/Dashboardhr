'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BarChart, LineChart, PieChart } from '@/components/charts'
import { Download, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState } from 'react'

interface Metric {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

export function AnalyticsModule() {
  const [timeframe, setTimeframe] = useState('30d')
  const [metricType, setMetricType] = useState('cost')

  const metrics: Metric[] = [
    { label: 'Total Opex', value: '$2.4M', change: 12.5, trend: 'up' },
    { label: 'Cost Per Unit', value: '$45.20', change: -3.8, trend: 'down' },
    { label: 'Efficiency Rate', value: '87%', change: 5.2, trend: 'up' },
    { label: 'Resource Utilization', value: '73%', change: -1.2, trend: 'down' },
  ]

  const getTrendIcon = (trend: Metric['trend']) => {
    const icons = {
      up: <TrendingUp className="h-4 w-4 text-green-600" />,
      down: <TrendingDown className="h-4 w-4 text-red-600" />,
      stable: <Minus className="h-4 w-4 text-yellow-600" />
    }
    return icons[trend]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor operational performance metrics and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm font-medium">{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Trends</CardTitle>
            <CardDescription>Monthly operational cost breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500">Line Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Opex by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500">Doughnut Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key operational indicators over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500">Bar Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
