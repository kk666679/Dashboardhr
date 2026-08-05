'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Clock, Users, Target, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface KaizenEvent {
  id: string
  title: string
  description: string
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed'
  team: number
  duration: string
  impact: 'High' | 'Medium' | 'Low'
  date: string
}

export function KaizenModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const events: KaizenEvent[] = [
    { id: '1', title: 'Production Line Optimization', description: 'Reduce waste in assembly process', status: 'In Progress', team: 6, duration: '2 weeks', impact: 'High', date: '2026-07-15' },
    { id: '2', title: 'Inventory Management Improvement', description: 'Implement JIT inventory system', status: 'Planning', team: 4, duration: '1 month', impact: 'Medium', date: '2026-07-20' },
    { id: '3', title: 'Quality Control Process', description: 'Enhance QC procedures', status: 'Review', team: 8, duration: '3 weeks', impact: 'High', date: '2026-07-10' },
    { id: '4', title: 'Employee Training Program', description: 'Develop continuous learning culture', status: 'Completed', team: 3, duration: '1 week', impact: 'Medium', date: '2026-07-05' },
  ]

  const getStatusColor = (status: KaizenEvent['status']) => {
    const colors = {
      'Planning': 'secondary',
      'In Progress': 'default',
      'Review': 'warning',
      'Completed': 'success'
    }
    return colors[status] as any
  }

  const getImpactColor = (impact: KaizenEvent['impact']) => {
    const colors = {
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'secondary'
    }
    return colors[impact] as any
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kaizen Events</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Continuous improvement initiatives and events
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Kaizen Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{events.filter(e => e.status === 'In Progress').length}</div>
            <p className="text-xs text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'Completed').length}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{events.filter(e => e.impact === 'High').length}</div>
            <p className="text-xs text-gray-500">High Impact</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kaizen Events List</CardTitle>
          <CardDescription>All continuous improvement initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                    <Badge variant={getImpactColor(event.impact)}>{event.impact}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.team} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {event.date}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
