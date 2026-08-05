'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, Search, Download, Building, Globe,
  Users, Calendar, MapPin, Link2, 
  Mail, Phone, Award, Star, TrendingUp,
  Eye, Edit, Trash2, Filter, RefreshCw, MoreVertical
} from 'lucide-react'
import { useState } from 'react'

interface IndustryPartner {
  id: string
  name: string
  type: 'Supplier' | 'Client' | 'Association' | 'Regulatory' | 'Academic'
  industry: string
  location: string
  relationship: 'Strategic' | 'Tier 1' | 'Tier 2' | 'Affiliate'
  status: 'Active' | 'Inactive' | 'Pending'
  since: string
  contactPerson: string
  email: string
  phone: string
}

interface IndustryEvent {
  id: string
  name: string
  type: 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Trade Show'
  date: string
  location: string
  participants: number
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
  description: string
}

interface IndustryTrend {
  id: string
  title: string
  category: 'Technology' | 'Regulation' | 'Market' | 'Workforce' | 'Sustainability'
  impact: 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Emerging' | 'Declining'
  date: string
  description: string
}

export function IndustryRelationsModule() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('partners')

  const partners: IndustryPartner[] = [
    { id: '1', name: 'TechCorp Solutions', type: 'Supplier', industry: 'Technology', location: 'San Francisco, CA', relationship: 'Strategic', status: 'Active', since: '2022-01-15', contactPerson: 'Sarah Lee', email: 'sarah.lee@techcorp.com', phone: '(555) 111-2222' },
    { id: '2', name: 'Global Manufacturing Inc.', type: 'Client', industry: 'Manufacturing', location: 'Detroit, MI', relationship: 'Tier 1', status: 'Active', since: '2023-03-20', contactPerson: 'Mike Chen', email: 'mike.chen@gmi.com', phone: '(555) 222-3333' },
    { id: '3', name: 'Industry Standards Board', type: 'Regulatory', industry: 'Compliance', location: 'Washington, DC', relationship: 'Affiliate', status: 'Active', since: '2021-06-01', contactPerson: 'Emily Davis', email: 'emily@isb.org', phone: '(555) 333-4444' },
    { id: '4', name: 'State University', type: 'Academic', industry: 'Education', location: 'Boston, MA', relationship: 'Tier 2', status: 'Pending', since: '2024-01-10', contactPerson: 'Dr. Robert Wilson', email: 'r.wilson@stateu.edu', phone: '(555) 444-5555' },
  ]

  const events: IndustryEvent[] = [
    { id: '1', name: 'Tech Innovation Summit 2026', type: 'Conference', date: '2026-08-15', location: 'Las Vegas, NV', participants: 500, status: 'Upcoming', description: 'Annual technology innovation conference' },
    { id: '2', name: 'Supply Chain Workshop', type: 'Workshop', date: '2026-07-20', location: 'Chicago, IL', participants: 50, status: 'Ongoing', description: 'Optimizing supply chain operations' },
    { id: '3', name: 'Industry Regulatory Update', type: 'Webinar', date: '2026-07-10', location: 'Virtual', participants: 200, status: 'Completed', description: 'New compliance requirements for 2026' },
  ]

  const trends: IndustryTrend[] = [
    { id: '1', title: 'AI Integration in Manufacturing', category: 'Technology', impact: 'High', status: 'Active', date: '2026-07-01', description: 'Rapid adoption of AI and ML in manufacturing processes' },
    { id: '2', title: 'Sustainability Compliance', category: 'Regulation', impact: 'High', status: 'Emerging', date: '2026-06-15', description: 'New environmental regulations and reporting requirements' },
    { id: '3', title: 'Remote Workforce Optimization', category: 'Workforce', impact: 'Medium', status: 'Active', date: '2026-06-01', description: 'Optimizing distributed teams and remote work policies' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Upcoming': 'default',
      'Ongoing': 'warning',
      'Completed': 'success',
      'Cancelled': 'destructive',
      'Emerging': 'warning',
      'Declining': 'destructive'
    }
    return colors[status] || 'secondary'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, any> = {
      'Supplier': 'default',
      'Client': 'success',
      'Association': 'info',
      'Regulatory': 'warning',
      'Academic': 'secondary',
      'Conference': 'default',
      'Workshop': 'warning',
      'Webinar': 'info',
      'Networking': 'success',
      'Trade Show': 'secondary'
    }
    return colors[type] || 'secondary'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industry Relations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage industry partnerships, events, and market intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{partners.length}</div>
                <p className="text-xs text-gray-500">Industry Partners</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-xs text-gray-500">Active Events</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">5</div>
                <p className="text-xs text-gray-500">Industry Trends</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">750</div>
                <p className="text-xs text-gray-500">Network Reach</p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">
            <Building className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Industry Partners</CardTitle>
              <CardDescription>Strategic partners and stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search partners..."
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
                      <TableHead>Organization</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(partner.type)}>
                            {partner.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{partner.industry}</TableCell>
                        <TableCell>{partner.location}</TableCell>
                        <TableCell>{partner.relationship}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(partner.status)}>
                            {partner.status}
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

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Industry Events</CardTitle>
              <CardDescription>Conferences, workshops, and networking events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                            <Badge variant={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.participants} participants</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">{event.description}</p>
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

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Industry Trends</CardTitle>
              <CardDescription>Market intelligence and emerging trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend) => (
                  <Card key={trend.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{trend.title}</h3>
                            <Badge variant={getStatusColor(trend.status)}>
                              {trend.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{trend.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Impact:</span>
                          <Badge variant={trend.impact === 'High' ? 'destructive' : trend.impact === 'Medium' ? 'warning' : 'secondary'}>
                            {trend.impact}
                          </Badge>
                        </div>
                      </div>
                      <p className="mt-2">{trend.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Identified: {trend.date}</p>
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
