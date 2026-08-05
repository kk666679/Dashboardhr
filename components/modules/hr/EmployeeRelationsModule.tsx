'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, Search, Download, Users, Heart, 
  Clock, AlertCircle, CheckCircle2, 
  MessageCircle, FileText, Calendar,
  Edit, Trash2, Eye, Filter
} from 'lucide-react'
import { useState } from 'react'

interface Employee {
  id: string
  name: string
  department: string
  position: string
  status: 'Active' | 'On Leave' | 'Probation' | 'Terminated'
  joinDate: string
  email: string
  phone: string
}

interface Feedback {
  id: string
  employee: string
  type: 'Recognition' | 'Complaint' | 'Suggestion' | 'Compliment'
  content: string
  date: string
  status: 'New' | 'Reviewing' | 'Resolved' | 'Closed'
  department: string
}

interface Survey {
  id: string
  title: string
  department: string
  participants: number
  responseRate: number
  status: 'Active' | 'Closed' | 'Draft'
  startDate: string
  endDate: string
}

export function EmployeeRelationsModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('employees')

  const employees: Employee[] = [
    { id: '1', name: 'John Doe', department: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2023-01-15', email: 'john.d@company.com', phone: '(555) 123-4567' },
    { id: '2', name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager', status: 'Active', joinDate: '2022-06-01', email: 'jane.s@company.com', phone: '(555) 234-5678' },
    { id: '3', name: 'Bob Johnson', department: 'Sales', position: 'Sales Representative', status: 'On Leave', joinDate: '2023-03-10', email: 'bob.j@company.com', phone: '(555) 345-6789' },
    { id: '4', name: 'Alice Brown', department: 'HR', position: 'HR Coordinator', status: 'Probation', joinDate: '2024-01-01', email: 'alice.b@company.com', phone: '(555) 456-7890' },
    { id: '5', name: 'Mike Wilson', department: 'Engineering', position: 'Tech Lead', status: 'Active', joinDate: '2021-08-20', email: 'mike.w@company.com', phone: '(555) 567-8901' },
  ]

  const feedback: Feedback[] = [
    { id: '1', employee: 'John Doe', type: 'Recognition', content: 'Excellent work on the Q2 project delivery', date: '2026-07-15', status: 'New', department: 'Engineering' },
    { id: '2', employee: 'Jane Smith', type: 'Suggestion', content: 'Proposed new marketing strategy for Q3', date: '2026-07-14', status: 'Reviewing', department: 'Marketing' },
    { id: '3', employee: 'Bob Johnson', type: 'Complaint', content: 'Office equipment maintenance issues', date: '2026-07-12', status: 'Resolved', department: 'Sales' },
  ]

  const surveys: Survey[] = [
    { id: '1', title: 'Employee Engagement Survey Q2', department: 'All', participants: 150, responseRate: 82, status: 'Closed', startDate: '2026-06-01', endDate: '2026-06-30' },
    { id: '2', title: 'Department Culture Assessment', department: 'Engineering', participants: 25, responseRate: 76, status: 'Active', startDate: '2026-07-01', endDate: '2026-07-25' },
    { id: '3', title: 'Wellness Program Feedback', department: 'All', participants: 100, responseRate: 45, status: 'Draft', startDate: '2026-08-01', endDate: '2026-08-15' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Active': 'success',
      'On Leave': 'warning',
      'Probation': 'default',
      'Terminated': 'destructive',
      'New': 'default',
      'Reviewing': 'warning',
      'Resolved': 'success',
      'Closed': 'secondary',
      'Draft': 'secondary'
    }
    return colors[status] || 'secondary'
  }

  const getFeedbackIcon = (type: string) => {
    const icons: Record<string, any> = {
      'Recognition': <Heart className="h-4 w-4 text-red-500" />,
      'Complaint': <AlertCircle className="h-4 w-4 text-yellow-500" />,
      'Suggestion': <MessageCircle className="h-4 w-4 text-blue-500" />,
      'Compliment': <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    return icons[type] || <MessageCircle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Relations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage employee engagement, feedback, and workplace culture
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{employees.filter(e => e.status === 'Active').length}</div>
                <p className="text-xs text-gray-500">Active Employees</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{feedback.filter(f => f.status === 'Resolved').length}</div>
                <p className="text-xs text-gray-500">Resolved Issues</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">82%</div>
                <p className="text-xs text-gray-500">Avg Response Rate</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <p className="text-xs text-gray-500">Pending Reviews</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">
            <Users className="mr-2 h-4 w-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageCircle className="mr-2 h-4 w-4" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="surveys">
            <FileText className="mr-2 h-4 w-4" />
            Surveys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Complete list of all employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.joinDate}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Engagement</CardTitle>
              <CardDescription>Employee feedback and recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getFeedbackIcon(item.type)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.employee}</h4>
                              <Badge variant={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{item.department}</p>
                            <p className="mt-2">{item.content}</p>
                            <p className="text-sm text-gray-500 mt-2">{item.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>Employee Surveys</CardTitle>
              <CardDescription>Engagement and culture surveys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {surveys.map((survey) => (
                  <Card key={survey.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{survey.title}</h3>
                        <Badge variant={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Department</span>
                          <span>{survey.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Participants</span>
                          <span>{survey.participants}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Response Rate</span>
                          <span>{survey.responseRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Period</span>
                          <span>{survey.startDate} → {survey.endDate}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={survey.responseRate} />
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          View Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
