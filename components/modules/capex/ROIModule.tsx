'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Percent } from 'lucide-react'

interface ROIItem {
  id: string
  name: string
  investment: number
  returns: number
  roi: number
  paybackPeriod: string
  status: 'Positive' | 'Negative' | 'Neutral'
}

export function ROIModule() {
  const roiItems: ROIItem[] = [
    { id: '1', name: 'Factory Automation', investment: 750000, returns: 1250000, roi: 66.7, paybackPeriod: '2.5 years', status: 'Positive' },
    { id: '2', name: 'CRM System', investment: 200000, returns: 280000, roi: 40, paybackPeriod: '3.2 years', status: 'Positive' },
    { id: '3', name: 'Warehouse Expansion', investment: 1200000, returns: 1600000, roi: 33.3, paybackPeriod: '3.8 years', status: 'Positive' },
    { id: '4', name: 'Security Upgrade', investment: 150000, returns: 130000, roi: -13.3, paybackPeriod: 'N/A', status: 'Negative' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: ROIItem['status']) => {
    const colors = {
      'Positive': 'success',
      'Negative': 'destructive',
      'Neutral': 'warning'
    }
    return colors[status] as any
  }

  const averageROI = roiItems.reduce((acc, item) => acc + item.roi, 0) / roiItems.length
  const totalInvestment = roiItems.reduce((acc, item) => acc + item.investment, 0)
  const totalReturns = roiItems.reduce((acc, item) => acc + item.returns, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ROI Analysis</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyze return on investment for capital projects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{averageROI.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">Average ROI</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalInvestment)}</div>
                <p className="text-xs text-gray-500">Total Investment</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalReturns)}</div>
                <p className="text-xs text-gray-500">Total Returns</p>
              </div>
              <ArrowUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{roiItems.filter(i => i.status === 'Positive').length}</div>
                <p className="text-xs text-gray-500">Profitable Projects</p>
              </div>
              <Percent className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project ROI Details</CardTitle>
          <CardDescription>Detailed ROI analysis for each capital project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roiItems.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Investment</p>
                        <p className="font-medium">{formatCurrency(item.investment)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Returns</p>
                        <p className="font-medium">{formatCurrency(item.returns)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payback Period</p>
                        <p className="font-medium">{item.paybackPeriod}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: item.roi >= 0 ? 'green' : 'red' }}>
                        {item.roi >= 0 ? '+' : ''}{item.roi}%
                      </p>
                      <p className="text-xs text-gray-500">ROI</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.roi >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                      {item.roi >= 0 ? <ArrowUp className="h-6 w-6 text-green-600 dark:text-green-400" /> : <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
