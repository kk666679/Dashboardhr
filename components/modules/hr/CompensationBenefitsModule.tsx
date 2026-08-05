'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, Search, Download, RefreshCw, DollarSign, 
  TrendingUp, TrendingDown, Users, Calendar, 
  Edit, Trash2, Eye, FileText, PieChart,
  Award, Gift, Heart, Shield, Briefcase
} from 'lucide-react'
import { useState } from 'react'

interface CompensationPlan {
  id: string
  name: string
  type: 'Salary' | 'Bonus' | 'Commission' | 'Equity'
  amount: number
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'One-time'
  department: string
  status: 'Active' | 'Pending' | 'Expired'
  effectiveDate: string
  employees: number
}

interface Benefit {
  id: string
  name: string
  category: 'Health' | 'Retirement' | 'Insurance' | 'Wellness' | 'Other'
  provider: string
  costPerEmployee: number
  enrollment: number
  status: 'Active' | 'Upcoming' | 'Inactive'
}

export function CompensationBenefitsModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('compensation')

  const compensationPlans: CompensationPlan[] = [
    { id: '1', name: 'Executive Base Salary', type: 'Salary', amount: 250000, frequency: 'Monthly', department: 'Executive', status: 'Active', effectiveDate: '2026-01-01', employees: 5 },
    { id: '2', name: 'Performance Bonus Q2', type: 'Bonus', amount: 50000, frequency: 'Quarterly', department: 'All', status: 'Active', effectiveDate: '2026-04-01', employees: 150 },
    { id: '3', name: 'Sales Commission Plan', type: 'Commission', amount: 75000, frequency: 'Monthly', department: 'Sales', status: 'Active', effectiveDate: '2026-01-15', employees: 25 },
    { id: '4', name: 'Stock Options Program', type: 'Equity', amount: 100000, frequency: 'Annual', department: 'Tech', status: 'Pending', effectiveDate: '2026-07-01', employees: 80 },
    { id: '5', name: 'Holiday Bonus', type: 'Bonus', amount: 5000, frequency: 'One-time', department: 'All', status: 'Expired', effectiveDate: '2025-12-01', employees: 200 },
  ]

  const benefits: Benefit[] = [
    { id: '1', name: 'Health Insurance Premium', category: 'Health', provider: 'Cigna', costPerEmployee: 8500, enrollment: 180, status: 'Active' },
    { id: '2', name: '401(k) Matching', category: 'Retirement', provider: 'Fidelity', costPerEmployee: 12000, enrollment: 150, status: 'Active' },
    { id: '3', name: 'Life Insurance', category: 'Insurance', provider: 'MetLife', costPerEmployee: 2400, enrollment: 190, status: 'Active' },
    { id: '4', name: 'Wellness Program', category: 'Wellness', provider: 'Virgin Pulse', costPerEmployee: 1500, enrollment: 120, status: 'Active' },
    { id: '5', name: 'Tuition Reimbursement', category: 'Other', provider: 'Internal', costPerEmployee: 5000, enrollment: 45, status: 'Active' },
    { id: '6', name: 'Dental Insurance', category: 'Health', provider: 'Delta Dental', costPerEmployee: 1800, enrollment: 160, status: 'Active' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Active': 'success',
      'Pending': 'warning',
      'Expired': 'destructive',
      'Inactive': 'secondary',
      'Upcoming': 'default'
    }
    return colors[status] || 'secondary'
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'Salary': <DollarSign className="h-4 w-4" />,
      'Bonus': <Award className="h-4 w-4" />,
      'Commission': <Briefcase className="h-4 w-4" />,
      'Equity': <TrendingUp className="h-4 w-4" />
    }
    return icons[type] || <DollarSign className="h-4 w-4" />
  }

  const totalCompensation = compensationPlans.reduce((acc, p) => acc + p.amount, 0)
  const totalBenefitsCost = benefits.reduce((acc, b) => acc + (b.costPerEmployee * b.enrollment), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compensation & Benefits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage employee compensation packages and benefits programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalCompensation)}</div>
                <p className="text-xs text-gray-500">Total Compensation</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalBenefitsCost)}</div>
                <p className="text-xs text-gray-500">Benefits Cost</p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{benefits.filter(b => b.status === 'Active').length}</div>
                <p className="text-xs text-gray-500">Active Benefits</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">92%</div>
                <p className="text-xs text-gray-500">Employee Participation</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="compensation">
            <DollarSign className="mr-2 h-4 w-4" />
            Compensation Plans
          </TabsTrigger>
          <TabsTrigger value="benefits">
            <Heart className="mr-2 h-4 w-4" />
            Benefits Programs
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <PieChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compensation">
          <Card>
            <CardHeader>
              <CardTitle>Compensation Plans</CardTitle>
              <CardDescription>Manage salary, bonus, commission, and equity plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="bonus">Bonus</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compensationPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(plan.type)}
                            <span>{plan.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(plan.amount)}</TableCell>
                        <TableCell>{plan.frequency}</TableCell>
                        <TableCell>{plan.department}</TableCell>
                        <TableCell>{plan.employees}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                        </TableCell>
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

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Programs</CardTitle>
              <CardDescription>Employee benefits and wellness programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit) => (
                  <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {benefit.category === 'Health' && <Heart className="h-4 w-4 text-red-500" />}
                            {benefit.category === 'Retirement' && <Shield className="h-4 w-4 text-blue-500" />}
                            {benefit.category === 'Insurance' && <Briefcase className="h-4 w-4 text-purple-500" />}
                            {benefit.category === 'Wellness' && <Gift className="h-4 w-4 text-green-500" />}
                            <h3 className="font-medium">{benefit.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{benefit.provider}</p>
                        </div>
                        <Badge variant={getStatusColor(benefit.status)}>
                          {benefit.status}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Cost/Employee</p>
                          <p className="font-medium">{formatCurrency(benefit.costPerEmployee)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Enrollment</p>
                          <p className="font-medium">{benefit.enrollment}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={(benefit.enrollment / 200) * 100} />
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((benefit.enrollment / 200) * 100)}% participation
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compensation Distribution</CardTitle>
                <CardDescription>Breakdown by type and department</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-500">Pie Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits Usage</CardTitle>
                <CardDescription>Employee participation by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-500">Bar Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Cost Trends</CardTitle>
                <CardDescription>Compensation and benefits costs over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-500">Line Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
