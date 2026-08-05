'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingDown, Clock, Package, Users, ArrowRight } from 'lucide-react'

export function LeanModule() {
  const metrics = [
    { label: 'Waste Reduction', value: 72, target: 85, status: 'On Track' },
    { label: 'Cycle Time', value: 45, target: 35, unit: 'mins', status: 'Needs Improvement' },
    { label: 'Inventory Turnover', value: 8.5, target: 10, status: 'On Track' },
    { label: 'Value Added Ratio', value: 64, target: 75, status: 'Needs Improvement' },
  ]

  const projects = [
    { id: '1', name: '5S Implementation', status: 'In Progress', progress: 80, department: 'Production' },
    { id: '2', name: 'Value Stream Mapping', status: 'Completed', progress: 100, department: 'Operations' },
    { id: '3', name: 'TPM Initiative', status: 'Planning', progress: 25, department: 'Maintenance' },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      'On Track': 'success',
      'Needs Improvement': 'warning',
      'Completed': 'success',
      'In Progress': 'default',
      'Planning': 'secondary'
    }
    return colors[status as keyof typeof colors] as any
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lean Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Eliminate waste and maximize value
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">72%</div>
                <p className="text-xs text-gray-500">Waste Reduction</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">45min</div>
                <p className="text-xs text-gray-500">Avg Cycle Time</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">8.5x</div>
                <p className="text-xs text-gray-500">Inventory Turnover</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">64%</div>
                <p className="text-xs text-gray-500">Value Added Ratio</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lean Metrics</CardTitle>
          <CardDescription>Key performance indicators for lean initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{metric.label}</span>
                    {metric.unit && <span className="text-sm text-gray-500 ml-1">({metric.unit})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.value}{metric.unit ? '' : '%'}</span>
                    <span className="text-sm text-gray-500">/ {metric.target}{metric.unit ? '' : '%'}</span>
                    <Badge variant={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={(metric.value / metric.target) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lean Projects</CardTitle>
          <CardDescription>Current lean improvement initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.department}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Progress value={project.progress} />
                  </div>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
