"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus, Search, Download, BookOpen, Users,
  Calendar, Clock, Award, Star, TrendingUp,
  Filter, Eye, Edit, Trash2, MessageCircle,
  GraduationCap, Target, Sparkles, Zap, Brain,
  Layers, ClipboardList,
} from 'lucide-react'
import { useState, useMemo } from 'react'

// ── Reusable primitives ───────────────────────────────────────────────────────
import {
  KpiCardGrid,
  PageContainer,
  SearchFilterBar,
  StatusBadge,
  ActionButtonGroup,
  EmptyState,
} from '@/components/modules/common'
import {
  ChartCard,
  BarChart as RechartsBarChart,
  LineChart,
  PieChart,
  RadarChart,
} from '@/components/charts'

interface Course {
  id: string
  title: string
  category: 'Technical' | 'Leadership' | 'Soft Skills' | 'Compliance' | 'Industry'
  provider: string
  format: 'Online' | 'In-Person' | 'Hybrid'
  duration: string
  status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled'
  enrolled: number
  completionRate: number
  startDate: string
  endDate: string
}

interface Training {
  id: string
  name: string
  employee: string
  department: string
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Dropped'
  completionDate: string
  score: number
  feedback: string
}

interface Certification {
  id: string
  name: string
  employee: string
  department: string
  issuingAuthority: string
  status: 'Active' | 'Expiring' | 'Expired' | 'Pending'
  issueDate: string
  expiryDate: string
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
}

const COURSE_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'Active':    { label: 'Active',    color: 'bg-green-100 text-green-700' },
  'Upcoming':  { label: 'Upcoming',  color: 'bg-blue-100 text-blue-700' },
  'Completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  'Cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

const TRAINING_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'Enrolled':    { label: 'Enrolled',    color: 'bg-blue-100 text-blue-700' },
  'In Progress': { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  'Completed':   { label: 'Completed',   color: 'bg-green-100 text-green-700' },
  'Dropped':     { label: 'Dropped',     color: 'bg-gray-100 text-gray-600' },
}

const CERT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'Active':   { label: 'Active',   color: 'bg-green-100 text-green-700' },
  'Expiring': { label: 'Expiring', color: 'bg-amber-100 text-amber-700' },
  'Expired':  { label: 'Expired',  color: 'bg-red-100 text-red-700' },
  'Pending':  { label: 'Pending',  color: 'bg-blue-100 text-blue-700' },
}

export function LearningDevelopmentModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('courses')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const courses: Course[] = [
    { id: '1', title: 'Advanced React & TypeScript', category: 'Technical', provider: 'Tech Academy', format: 'Online', duration: '6 weeks', status: 'Active', enrolled: 25, completionRate: 78, startDate: '2026-06-15', endDate: '2026-07-27' },
    { id: '2', title: 'Leadership Essentials', category: 'Leadership', provider: 'Harvard Business', format: 'Hybrid', duration: '4 weeks', status: 'Active', enrolled: 15, completionRate: 65, startDate: '2026-07-01', endDate: '2026-07-29' },
    { id: '3', title: 'Data Analytics Bootcamp', category: 'Technical', provider: 'DataCamp', format: 'Online', duration: '8 weeks', status: 'Upcoming', enrolled: 0, completionRate: 0, startDate: '2026-08-01', endDate: '2026-09-26' },
    { id: '4', title: 'Conflict Resolution', category: 'Soft Skills', provider: 'SkillsSoft', format: 'In-Person', duration: '2 days', status: 'Completed', enrolled: 30, completionRate: 92, startDate: '2026-06-01', endDate: '2026-06-02' },
  ]

  const trainings: Training[] = [
    { id: '1', name: 'React Development', employee: 'John Doe', department: 'Engineering', status: 'In Progress', completionDate: '2026-08-01', score: 85, feedback: 'Good progress' },
    { id: '2', name: 'Leadership Workshop', employee: 'Jane Smith', department: 'Marketing', status: 'Enrolled', completionDate: '2026-07-30', score: 0, feedback: 'Starting next week' },
    { id: '3', name: 'Data Analytics', employee: 'Bob Johnson', department: 'Sales', status: 'Completed', completionDate: '2026-07-15', score: 94, feedback: 'Excellent performance' },
  ]

  const certifications: Certification[] = [
    { id: '1', name: 'AWS Certified Developer', employee: 'John Doe', department: 'Engineering', issuingAuthority: 'Amazon Web Services', status: 'Active', issueDate: '2025-01-15', expiryDate: '2028-01-15', level: 'Advanced' },
    { id: '2', name: 'Project Management Professional', employee: 'Jane Smith', department: 'Marketing', issuingAuthority: 'PMI', status: 'Expiring', issueDate: '2022-07-01', expiryDate: '2026-07-01', level: 'Expert' },
    { id: '3', name: 'Six Sigma Green Belt', employee: 'Mike Wilson', department: 'Engineering', issuingAuthority: 'ASQ', status: 'Active', issueDate: '2024-03-01', expiryDate: '2027-03-01', level: 'Intermediate' },
  ]

  // ── Derived analytics ───────────────────────────────────────────────────────
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [courses, searchTerm, categoryFilter])

  const completionRate = Math.round(
    courses.filter((c) => c.status === 'Completed').length / (courses.length || 1) * 100,
  )
  const avgScore = Math.round(
    trainings.reduce((sum, t) => sum + t.score, 0) / (trainings.length || 1),
  )

  const kpiItems = [
    {
      label: 'Active Courses',
      value: courses.filter((c) => c.status === 'Active').length,
      sub: `${courses.filter((c) => c.status === 'Upcoming').length} upcoming`,
      icon: <BookOpen className="h-4 w-4" />,
      color: 'text-blue-600',
      trend: 'up' as const,
    },
    {
      label: 'Total Enrollments',
      value: courses.reduce((sum, c) => sum + c.enrolled, 0),
      sub: 'across all courses',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600',
      trend: 'up' as const,
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      sub: 'course completion',
      icon: <Target className="h-4 w-4" />,
      color: 'text-green-600',
      trend: 'up' as const,
    },
    {
      label: 'Active Certifications',
      value: certifications.filter((c) => c.status === 'Active').length,
      sub: `${certifications.filter((c) => c.status === 'Expiring').length} expiring soon`,
      icon: <Award className="h-4 w-4" />,
      color: 'text-amber-600',
    },
  ]

  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>()
    courses.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [courses])

  const monthlyTrendData = [
    { month: 'Jan', enrollments: 12, completions: 8 },
    { month: 'Feb', enrollments: 18, completions: 12 },
    { month: 'Mar', enrollments: 22, completions: 16 },
    { month: 'Apr', enrollments: 28, completions: 20 },
    { month: 'May', enrollments: 32, completions: 24 },
    { month: 'Jun', enrollments: 40, completions: 30 },
  ]

  const skillRadarData = [
    { skill: 'Technical', coverage: 85 },
    { skill: 'Leadership', coverage: 70 },
    { skill: 'Soft Skills', coverage: 78 },
    { skill: 'Compliance', coverage: 92 },
    { skill: 'Industry', coverage: 64 },
  ]

  const departmentEnrollmentData = [
    { dept: 'Engineering', enrolled: 25, completed: 18 },
    { dept: 'Marketing', enrolled: 15, completed: 12 },
    { dept: 'Sales', enrolled: 20, completed: 15 },
    { dept: 'HR', enrolled: 10, completed: 9 },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Active': 'success',
      'Upcoming': 'default',
      'Completed': 'success',
      'Cancelled': 'destructive',
      'Enrolled': 'default',
      'In Progress': 'warning',
      'Dropped': 'secondary',
      'Expiring': 'warning',
      'Expired': 'destructive',
      'Pending': 'warning',
    }
    return colors[status] || 'secondary'
  }

  const courseFilters = [
    {
      key: 'category',
      label: 'Category',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'Technical', label: 'Technical' },
        { value: 'Leadership', label: 'Leadership' },
        { value: 'Soft Skills', label: 'Soft Skills' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Industry', label: 'Industry' },
      ],
    },
  ]

  return (
    <PageContainer maxWidth="full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning & Development</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage training programs, courses, and employee development
          </p>
        </div>
        <ActionButtonGroup
          align="right"
          actions={[
            {
              label: 'Export',
              variant: 'outline',
              icon: <Download className="h-4 w-4" />,
              onClick: () => {},
            },
            {
              label: 'New Course',
              variant: 'default',
              icon: <Plus className="h-4 w-4" />,
              onClick: () => {},
            },
          ]}
        />
      </div>

      {/* KPI Grid */}
      <KpiCardGrid items={kpiItems} columns={4} />

      {/* Analytics Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Course Category Distribution"
          description="Breakdown of courses by category"
          downloadData={categoryDistribution}
          downloadFilename="learning-category-distribution.csv"
        >
          <PieChart
            data={categoryDistribution}
            innerRadius={45}
            outerRadius={80}
            aspectRatio={2}
          />
        </ChartCard>
        <ChartCard
          title="Enrollment & Completion Trend"
          description="Monthly learning activity over the last 6 months"
          kpi="40"
          trend="up"
          trendLabel="vs last month"
          aiInsight="AI detected a +20% enrollment growth"
          downloadData={monthlyTrendData}
          downloadFilename="learning-trend.csv"
        >
          <LineChart
            data={monthlyTrendData}
            xKey="month"
            yKey={['enrollments', 'completions']}
            aspectRatio={2}
          />
        </ChartCard>
        <ChartCard
          title="Skill Coverage Score"
          description="Competency coverage across skill domains"
          aiInsight="AI suggests leadership training to close gap"
          downloadData={skillRadarData}
          downloadFilename="learning-skill-coverage.csv"
        >
          <RadarChart
            data={skillRadarData}
            xKey="skill"
            yKey="coverage"
            aspectRatio={1.5}
          />
        </ChartCard>
        <ChartCard
          title="Department Enrollments"
          description="Enrollments and completions by department"
          downloadData={departmentEnrollmentData}
          downloadFilename="learning-department-enrollments.csv"
        >
<RechartsBarChart
            data={departmentEnrollmentData}
            xKey="dept"
            yKey={['enrolled', 'completed']}
            aspectRatio={2}
          />
        </ChartCard>
      </div>

      {/* AI Learning Recommendations */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Brain className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                AI-Powered Learning Recommendations
                <Badge variant="success" className="gap-1 text-[10px]">
                  <Sparkles className="h-3 w-3" /> AI
                </Badge>
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on current skill coverage, we recommend prioritizing{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">Leadership</span> and{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">Soft Skills</span> training
                to close competency gaps and improve overall team effectiveness.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" /> Skill Gap +12%
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Layers className="h-3 w-3" /> 3 recommended paths
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <ClipboardList className="h-3 w-3" /> 8 employees flagged
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="trainings">
            <Users className="mr-2 h-4 w-4" />
            Trainings
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="mr-2 h-4 w-4" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>Available training courses and programs</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchFilterBar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search courses..."
                filters={courseFilters}
              />

              {filteredCourses.length === 0 ? (
                <EmptyState
                  icon={<BookOpen className="h-8 w-8" />}
                  title="No courses found"
                  description="Try adjusting your search or category filter."
                  action={
                    <Button onClick={() => { setSearchTerm(''); setCategoryFilter('all') }}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{course.category}</Badge>
                              <Badge variant="secondary">{course.format}</Badge>
                            </div>
                          </div>
                          <StatusBadge status={course.status} mapping={COURSE_STATUS_MAP} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Provider</p>
                            <p>{course.provider}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p>{course.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Enrolled</p>
                            <p>{course.enrolled} students</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Completion</p>
                            <p>{course.completionRate}%</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Progress value={course.completionRate} />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {course.startDate} → {course.endDate}
                          </span>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainings">
          <Card>
            <CardHeader>
              <CardTitle>Employee Trainings</CardTitle>
              <CardDescription>Individual training progress and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Training Name</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell className="font-medium">{training.name}</TableCell>
                        <TableCell>{training.employee}</TableCell>
                        <TableCell>{training.department}</TableCell>
                        <TableCell>
                          <StatusBadge status={training.status} mapping={TRAINING_STATUS_MAP} />
                        </TableCell>
                        <TableCell>{training.score > 0 ? `${training.score}%` : 'N/A'}</TableCell>
                        <TableCell>{training.completionDate}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageCircle className="h-4 w-4" />
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

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Professional certifications and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert) => (
                  <Card key={cert.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-gray-500">{cert.issuingAuthority}</p>
                        </div>
                        <StatusBadge status={cert.status} mapping={CERT_STATUS_MAP} />
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Employee</span>
                          <span>{cert.employee}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Department</span>
                          <span>{cert.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Level</span>
                          <Badge variant="secondary">{cert.level}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Expiry</span>
                          <span>{cert.expiryDate}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
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
      </Tabs>
    </PageContainer>
  )
}
