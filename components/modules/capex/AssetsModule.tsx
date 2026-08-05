'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

interface Asset {
  id: string
  name: string
  category: string
  value: number
  purchaseDate: string
  status: 'Active' | 'Depreciating' | 'Maintenance' | 'Disposed'
  department: string
}

export function AssetsModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [assets] = useState<Asset[]>([
    { id: '1', name: 'Production Machine X-2000', category: 'Equipment', value: 250000, purchaseDate: '2025-01-15', status: 'Active', department: 'Manufacturing' },
    { id: '2', name: 'Server Infrastructure', category: 'IT', value: 180000, purchaseDate: '2025-02-20', status: 'Active', department: 'IT' },
    { id: '3', name: 'Office Building - Main', category: 'Real Estate', value: 1200000, purchaseDate: '2024-06-10', status: 'Active', department: 'Facilities' },
    { id: '4', name: 'Fleet Vehicles', category: 'Transportation', value: 350000, purchaseDate: '2025-03-05', status: 'Maintenance', department: 'Logistics' },
    { id: '5', name: 'Software Licenses', category: 'Software', value: 75000, purchaseDate: '2025-04-01', status: 'Depreciating', department: 'IT' },
  ])

  const getStatusColor = (status: Asset['status']) => {
    const colors = {
      Active: 'default',
      Depreciating: 'warning',
      Maintenance: 'secondary',
      Disposed: 'destructive'
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

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your capital assets and track their lifecycle
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-gray-500">Total Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(assets.reduce((acc, a) => acc + a.value, 0))}</div>
            <p className="text-xs text-gray-500">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{assets.filter(a => a.status === 'Active').length}</div>
            <p className="text-xs text-gray-500">Active Assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{assets.filter(a => a.status === 'Maintenance').length}</div>
            <p className="text-xs text-gray-500">Under Maintenance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>Overview of all capital assets in the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{formatCurrency(asset.value)}</TableCell>
                    <TableCell>{asset.purchaseDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{asset.department}</TableCell>
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
    </div>
  )
}
