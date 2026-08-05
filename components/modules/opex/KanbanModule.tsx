'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MoreVertical, User, Calendar } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: 'Todo' | 'In Progress' | 'Review' | 'Done'
  priority: 'High' | 'Medium' | 'Low'
  assignee: string
  dueDate: string
}

export function KanbanModule() {
  const tasks: Task[] = [
    { id: '1', title: 'Implement JIT Inventory', description: 'Set up just-in-time inventory system', status: 'Todo', priority: 'High', assignee: 'John Doe', dueDate: '2026-08-15' },
    { id: '2', title: 'Design New Workflow', description: 'Create optimized workflow for production', status: 'In Progress', priority: 'Medium', assignee: 'Jane Smith', dueDate: '2026-07-30' },
    { id: '3', title: 'Review Quality Metrics', description: 'Analyze Q2 quality control data', status: 'Review', priority: 'High', assignee: 'Bob Johnson', dueDate: '2026-07-25' },
    { id: '4', title: 'Update SOPs', description: 'Revise standard operating procedures', status: 'Todo', priority: 'Low', assignee: 'Alice Brown', dueDate: '2026-08-20' },
    { id: '5', title: 'Team Training Session', description: 'Conduct Lean Six Sigma training', status: 'Done', priority: 'Medium', assignee: 'Mike Wilson', dueDate: '2026-07-20' },
  ]

  const columns = ['Todo', 'In Progress', 'Review', 'Done'] as const

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'secondary'
    }
    return colors[priority] as any
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize and manage operational tasks
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((column) => (
          <Card key={column}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{column}</span>
                <Badge>{tasks.filter(t => t.status === column).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border p-3 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                {tasks.filter((t) => t.status === column).length === 0 && (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No tasks in {column}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
