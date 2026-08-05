'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Award, Target, BarChart, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

export function SixSigmaModule() {
  const projects = [
    { id: '1', name: 'Production Defect Reduction', phase: 'Define', progress: 100, status: 'Completed', sigma: 4.8 },
    { id: '2', name: 'Supply Chain Optimization', phase: 'Analyze', progress: 55, status: 'In Progress', sigma: 3.2 },
    { id: '3', name: 'Customer Satisfaction Improvement', phase: 'Improve', progress: 75, status: 'In Progress', sigma: 4.1 },
    { id: '4', name: 'Process Standardization', phase: 'Measure', progress: 30, status: 'Planning', sigma: 2.9 },
  ]

  const beltLevels = [
    { level: 'Black Belt', count: 4, color: 'bg-purple-600' },
    { level: 'Green Belt', count: 12, color: 'bg-green-600' },
    { level: 'Yellow Belt', count: 25, color: 'bg-yellow-600' },
    { level: 'White Belt', count: 40, color: 'bg-gray-600' },
  ]

  const getPhaseColor = (phase: string) => {
    const colors = {
      'Define': 'default',
      'Measure': 'secondary',
      'Analyze': 'warning',
      'Improve': 'success',
      'Control': 'info'
    }
    return colors[phase as keyof typeof colors] as any
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Six Sigma</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data-driven quality improvement methodologies
          </p>
        </div>
        <Button>
          <Target className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <p className="text-xs text-gray-500">Avg Sigma Level</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-xs text-gray-500">Active Projects</p>
              </div>
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <p className="text-xs text-gray-500">Completed Projects</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">81</div>
                <p className="text-xs text-gray-500">Certified Practitioners</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Six Sigma Projects</CardTitle>
            <CardDescription>DMAIC projects across the organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getPhaseColor(project.phase)}>{project.phase}</Badge>
                        <span className="text-sm text-gray-500">Sigma: {project.sigma}</span>
                      </div>
                    </div>
                    <Badge variant={project.status === 'Completed' ? 'success' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.status !== 'Completed' && (
                    <div className="mt-2">
                      <Progress value={project.progress} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certification Levels</CardTitle>
            <CardDescription>Six Sigma belt distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {beltLevels.map((belt) => (
                <div key={belt.level}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${belt.color}`} />
                      <span className="font-medium">{belt.level}</span>
                    </div>
                    <span className="text-sm font-medium">{belt.count}</span>
                  </div>
                  <Progress value={(belt.count / beltLevels[0].count) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
