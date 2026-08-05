'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { useState } from 'react'

interface BudgetItem {
  id: string
  category: string
  allocated: number
  spent: number
  remaining: number
  period: string
  status: 'On Track' | 'Warning' | 'Over Budget'
}

export function BudgetModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('all')
  
  const budgetItems: BudgetItem[] = [
    { id: '1', category: 'Equipment Purchase', allocated: 500000, spent: 350000, remaining: 150000, period: 'Q2 2026', status: 'On Track' },
    { id: '2', category: 'Infrastructure', allocated: 300000, spent: 280000, remaining: 20000, period: 'Q2 2026', status: 'Warning' },
    { id: '3', category: 'R&D', allocated: 200000, spent: 210000, remaining: -10000, period: 'Q2 2026', status: 'Over Budget' },
    { id: '4', category: 'Marketing', allocated: 150000, spent: 90000, remaining: 60000, period: 'Q2 2026', status: 'On Track' },
    { id: '5', category: 'Training', allocated: 100000, spent: 45000, remaining: 55000, period: 'Q2 2026', status: 'On Track' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: BudgetItem['status']) => {
    const colors = {
      'On Track': 'default',
      'Warning': 'warning',
      'Over Budget': 'destructive'
    }
    return colors[status] as any
  }

  const totalAllocated = budgetItems.reduce((acc, item) => acc + item.allocated, 0)
  const totalSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0)
  const totalRemaining = budgetItems.reduce((acc, item) => acc + item.remaining, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage capital expenditure budgets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget Item
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAllocated)}</div>
            <p className="text-xs text-gray-500">Total Allocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-gray-500">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalRemaining)}</div>
            <p className="text-xs text-gray-500">Total Remaining</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Detailed breakdown of budget allocation and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search budget items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="q1">Q1 2026</SelectItem>
                  <SelectItem value="q2">Q2 2026</SelectItem>
                  <SelectItem value="q3">Q3 2026</SelectItem>
                  <SelectItem value="q4">Q4 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {budgetItems.map((item) => {
              const percentage = Math.min((item.spent / item.allocated) * 100, 100)
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-gray-500">{item.period}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
