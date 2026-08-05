'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, Search, Download, Users, UserPlus, 
  Calendar, Clock, Briefcase, MapPin, 
  Filter, Eye, Edit, Trash2, CheckCircle2,
  XCircle, AlertCircle, TrendingUp, Award
} from 'lucide-react'
import { useState } from 'react'

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'
  status: 'Draft' | 'Published' | 'Reviewing' | 'Filled' | 'Closed'
  applicants: number
  postDate: string
  closeDate: string
}

interface Candidate {
  id: string
  name: string
  email: string
  position: string
  stage: 'Applied' | 'Screening' | 'Interview' | 'Technical' | 'Final' | 'Offered' | 'Hired' | 'Rejected'
  matchScore: number
  appliedDate: string
  experience: string
}

export function TalentAcquisitionModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('openings')

  const openings: JobOpening[] = [
    { id: '1', title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', level: 'Senior', status: 'Published', applicants: 45, postDate: '2026-06-15', closeDate: '2026-08-15' },
    { id: '2', title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time', level: 'Lead', status: 'Reviewing', applicants: 28, postDate: '2026-06-20', closeDate: '2026-08-20' },
    { id: '3', title: 'UX Designer', department: 'Design', location: 'Remote', type: 'Contract', level: 'Mid', status: 'Published', applicants: 32, postDate: '2026-07-01', closeDate: '2026-09-01' },
    { id: '4', title: 'Data Analyst', department: 'Analytics', location: 'Chicago, IL', type: 'Full-time', level: 'Entry', status: 'Draft', applicants: 0, postDate: '2026-07-10', closeDate: '2026-08-10' },
    { id: '5', title: 'HR Business Partner', department: 'HR', location: 'San Francisco, CA', type: 'Full-time', level: 'Senior', status: 'Filled', applicants: 52, postDate: '2026-05-01', closeDate: '2026-07-01' },
  ]

  const candidates: Candidate[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice.j@email.com', position: 'Senior Software Engineer', stage: 'Technical', matchScore: 92, appliedDate: '2026-07-10', experience: '8 years' },
    { id: '2', name: 'Bob Smith', email: 'bob.s@email.com', position: 'Senior Software Engineer', stage: 'Interview', matchScore: 85, appliedDate: '2026-07-08', experience: '6 years' },
    { id: '3', name: 'Carol Davis', email: 'carol.d@email.com', position: 'Product Manager', stage: 'Final', matchScore: 88, appliedDate: '2026-07-05', experience: '7 years' },
    { id: '4', name: 'David Wilson', email: 'david.w@email.com', position: 'UX Designer', stage: 'Applied', matchScore: 72, appliedDate: '2026-07-12', experience: '4 years' },
    { id: '5', name: 'Eva Martinez', email: 'eva.m@email.com', position: 'Data Analyst', stage: 'Screening', matchScore: 78, appliedDate: '2026-07-11', experience: '3 years' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Draft': 'secondary',
      'Published': 'default',
      'Reviewing': 'warning',
      'Filled': 'success',
      'Closed': 'destructive',
      'Applied': 'secondary',
      'Screening': 'default',
      'Interview': 'info',
      'Technical': 'warning',
      'Final': 'success',
      'Offered': 'success',
      'Hired': 'success',
      'Rejected': 'destructive'
    }
    return colors[status] || 'secondary'
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, any> = {
      'Entry': 'secondary',
      'Mid': 'default',
      'Senior': 'info',
      'Lead': 'warning',
      'Executive': 'destructive'
    }
    return colors[level] || 'secondary'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Acquisition</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage job openings, candidates, and hiring process
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job Opening
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{openings.filter(o => o.status === 'Published' || o.status === 'Reviewing').length}</div>
                <p className="text-xs text-gray-500">Active Openings</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{candidates.length}</div>
                <p className="text-xs text-gray-500">Total Candidates</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">84%</div>
                <p className="text-xs text-gray-500">Avg Match Score</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">15d</div>
                <p className="text-xs text-gray-500">Avg Time to Hire</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="openings">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Openings
          </TabsTrigger>
          <TabsTrigger value="candidates">
            <Users className="mr-2 h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="pipeline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="openings">
          <Card>
            <CardHeader>
              <CardTitle>Job Openings</CardTitle>
              <CardDescription>Current positions available across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search openings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {openings.map((opening) => (
                  <Card key={opening.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{opening.title}</h3>
                          <p className="text-sm text-gray-500">{opening.department}</p>
                        </div>
                        <Badge variant={getStatusColor(opening.status)}>
                          {opening.status}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{opening.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span>{opening.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={getLevelColor(opening.level)}>{opening.level}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>{opening.applicants} applicants</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Posted: {opening.postDate}</span>
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

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>Manage candidate applications and pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Match Score</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(candidate.stage)}>
                            {candidate.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={candidate.matchScore} className="w-16" />
                            <span>{candidate.matchScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.experience}</TableCell>
                        <TableCell>{candidate.appliedDate}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <XCircle className="h-4 w-4 text-red-500" />
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

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Candidate distribution across hiring stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {['Applied', 'Screening', 'Interview', 'Technical', 'Final', 'Offered', 'Hired'].map((stage) => {
                  const count = candidates.filter(c => c.stage === stage).length
                  const percentage = (count / candidates.length) * 100
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{stage}</span>
                        <span className="text-sm">{count}</span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
