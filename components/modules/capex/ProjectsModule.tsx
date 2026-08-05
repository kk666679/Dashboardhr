'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed'
  startDate: string
  endDate: string
  budget: number
  team: number
}

export function ProjectsModule() {
  const projects: Project[] = [
    { id: '1', name: 'Factory Automation', description: 'Implementing automated assembly line', progress: 65, status: 'In Progress', startDate: '2026-01-15', endDate: '2026-08-30', budget: 750000, team: 12 },
    { id: '2', name: 'CRM Implementation', description: 'Enterprise-wide CRM system rollout', progress: 30, status: 'Planning', startDate: '2026-03-01', endDate: '2026-09-15', budget: 200000, team: 8 },
    { id: '3', name: 'Warehouse Expansion', description: 'Adding 50,000 sq ft warehouse space', progress: 90, status: 'Review', startDate: '2025-10-01', endDate: '2026-07-01', budget: 1200000, team: 20 },
    { id: '4', name: 'Security Upgrade', description: 'Cybersecurity infrastructure upgrade', progress: 100, status: 'Completed', startDate: '2025-12-01', endDate: '2026-05-15', budget: 150000, team: 5 },
  ]

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      'Planning': 'secondary',
      'In Progress': 'default',
      'Review': 'warning',
      'Completed': 'success'
    }
    return colors[status] as any
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage capital projects and track their progress
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-gray-500">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'In Progress').length}</div>
            <p className="text-xs text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'Completed').length}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.team, 0)}</div>
            <p className="text-xs text-gray-500">Team Members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{project.startDate} → {project.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{project.team} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Budget: {formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-500" />
                  <span>Tasks: 24/42</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
