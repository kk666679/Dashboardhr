import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Target, BarChart3, GitBranch, HelpCircle, AlertTriangle } from 'lucide-react';

const isoTools = [
  {
    title: 'Compliance Dashboard',
    description: 'Overview of ISO compliance status and metrics',
    href: '/dashboard/iso/compliance-dashboard',
    icon: BarChart3,
  },
  {
    title: 'Compliance Check',
    description: 'Check compliance against specific ISO clauses',
    href: '/dashboard/iso/compliance-check',
    icon: FileCheck,
  },
  {
    title: 'Compliance Score',
    description: 'Calculate overall compliance score',
    href: '/dashboard/iso/compliance-score',
    icon: Target,
  },
  {
    title: 'Gap Analysis',
    description: 'Identify gaps in ISO implementation',
    href: '/dashboard/iso/gap-analysis',
    icon: AlertTriangle,
  },
  {
    title: 'Audit Checklist',
    description: 'Generate and manage audit checklists',
    href: '/dashboard/iso/audit-checklist',
    icon: FileCheck,
  },
  {
    title: 'Create Audit Plan',
    description: 'Plan and schedule ISO audits',
    href: '/dashboard/iso/audit-create-plan',
    icon: Target,
  },
  {
    title: 'Generate Audit',
    description: 'Generate audit reports and findings',
    href: '/dashboard/iso/audit-generate',
    icon: FileCheck,
  },
  {
    title: 'CAPA Management',
    description: 'Corrective and Preventive Action management',
    href: '/dashboard/iso/capa-create',
    icon: AlertTriangle,
  },
  {
    title: 'Fishbone Analysis',
    description: 'Root cause analysis using fishbone diagrams',
    href: '/dashboard/iso/fishbone',
    icon: GitBranch,
  },
  {
    title: '5 Whys Analysis',
    description: 'Root cause analysis using 5 whys technique',
    href: '/dashboard/iso/five-whys',
    icon: HelpCircle,
  },
];

export default function ISODashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ISO Compliance Tools</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive tools for ISO compliance management, auditing, and continuous improvement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isoTools.map((tool) => (
          <Card key={tool.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <tool.icon className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
              <Button asChild className="w-full">
                <Link href={tool.href}>Access Tool</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}