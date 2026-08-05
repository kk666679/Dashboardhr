'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, User, FileText, Target } from 'lucide-react';
import type { ISOStandard, AuditPlan } from '@/types/iso';
import { format } from 'date-fns';

interface AuditCreatePlanProps {
  standard?: ISOStandard;
  /** Called to persist the plan to the DB. */
  onPersist?: (plan: Partial<AuditPlan>) => Promise<void>;
  isPersisting?: boolean;
  persistError?: string;
}

export function AuditCreatePlan({ standard = 'ISO9001', onPersist, isPersisting = false, persistError }: AuditCreatePlanProps) {
  const [plan, setPlan] = useState<Partial<AuditPlan>>({
    title: '',
    standard: standard as any,
    scope: '',
    objectives: [],
    auditors: [],
    auditees: [],
    clauses: [],
    status: 'draft',
    startDate: undefined,
    endDate: undefined,
  });
  const [newObjective, setNewObjective] = useState('');
  const [newAuditor, setNewAuditor] = useState('');
  const [newAuditee, setNewAuditee] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const addObjective = () => {
    if (newObjective.trim()) {
      setPlan(prev => ({
        ...prev,
        objectives: [...(prev.objectives || []), newObjective.trim()],
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setPlan(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index),
    }));
  };

  const addAuditor = () => {
    if (newAuditor.trim()) {
      setPlan(prev => ({
        ...prev,
        auditors: [...(prev.auditors || []), newAuditor.trim()],
      }));
      setNewAuditor('');
    }
  };

  const removeAuditor = (index: number) => {
    setPlan(prev => ({
      ...prev,
      auditors: prev.auditors?.filter((_, i) => i !== index),
    }));
  };

  const addAuditee = () => {
    if (newAuditee.trim()) {
      setPlan(prev => ({
        ...prev,
        auditees: [...(prev.auditees || []), newAuditee.trim()],
      }));
      setNewAuditee('');
    }
  };

  const removeAuditee = (index: number) => {
    setPlan(prev => ({
      ...prev,
      auditees: prev.auditees?.filter((_, i) => i !== index),
    }));
  };

  const createPlan = async () => {
    setIsCreating(true);
    try {
      if (onPersist) await onPersist(plan);
      setIsCreating(false);
      setCreated(true);
    } catch {
      setIsCreating(false);
    }
  };

  const clauses = [
    '4.1', '4.2', '4.3', '5.1', '5.2', '5.3', '6.1', '6.2', 
    '7.1', '7.2', '7.3', '7.4', '7.5', '8.1', '8.2', '8.3',
    '8.4', '8.5', '8.6', '8.7', '9.1', '9.2', '9.3', '10.1', '10.2', '10.3',
  ];

  const toggleClause = (clause: string) => {
    setPlan(prev => ({
      ...prev,
      clauses: prev.clauses?.includes(clause)
        ? prev.clauses.filter(c => c !== clause)
        : [...(prev.clauses || []), clause],
    }));
  };

  if (created) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Target className="h-5 w-5" />
              Audit Plan Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{plan.title}</div>
              <p className="text-gray-600">{plan.standard} - {plan.scope}</p>
              <div className="mt-4 flex justify-center gap-4">
                <Badge variant="outline">Start: {plan.startDate?.toLocaleDateString()}</Badge>
                <Badge variant="outline">End: {plan.endDate?.toLocaleDateString()}</Badge>
                <Badge>{(plan.auditors || []).length} Auditors</Badge>
              </div>
            </div>
            <Button onClick={() => setCreated(false)} className="w-full">
              Create Another Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Audit Plan - {standard}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Audit Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Q1 2024 Internal Quality Audit"
                value={plan.title || ''}
                onChange={(e) => setPlan(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="scope">Scope *</Label>
              <Input
                id="scope"
                placeholder="e.g., All QMS processes"
                value={plan.scope || ''}
                onChange={(e) => setPlan(prev => ({ ...prev, scope: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plan.startDate ? format(plan.startDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={plan.startDate}
                    onSelect={(date) => setPlan(prev => ({ ...prev, startDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plan.endDate ? format(plan.endDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={plan.endDate}
                    onSelect={(date) => setPlan(prev => ({ ...prev, endDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label>Objectives</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add an objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addObjective()}
              />
              <Button onClick={addObjective} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {plan.objectives && plan.objectives.length > 0 && (
              <div className="mt-2 space-y-1">
                {plan.objectives.map((obj, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{obj}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Auditors</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Add auditor..."
                  value={newAuditor}
                  onChange={(e) => setNewAuditor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAuditor()}
                />
                <Button onClick={addAuditor} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {plan.auditors && plan.auditors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {plan.auditors.map((auditor, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" /> {auditor}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAuditor(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Auditees</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Add auditee..."
                  value={newAuditee}
                  onChange={(e) => setNewAuditee(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAuditee()}
                />
                <Button onClick={addAuditee} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {plan.auditees && plan.auditees.length > 0 && (
                <div className="mt-2 space-y-1">
                  {plan.auditees.map((auditee, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" /> {auditee}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAuditee(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Clauses to Audit</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {clauses.map(clause => (
                <Badge
                  key={clause}
                  variant={plan.clauses?.includes(clause) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleClause(clause)}
                >
                  {clause}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{plan.clauses?.length || 0} clauses selected</p>
          </div>

          <Button
            onClick={createPlan}
            disabled={!plan.title || !plan.scope || !plan.startDate || !plan.endDate || isCreating || isPersisting}
            className="w-full"
          >
            {isCreating || isPersisting ? 'Creating Plan...' : 'Create Audit Plan'}
          </Button>
          {persistError && (
            <p className="text-sm text-destructive">{persistError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

