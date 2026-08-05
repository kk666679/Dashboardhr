'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import type { CAPAType, CAPASource, CAPAPriority } from '@/types/iso';
import { format } from 'date-fns';

interface CAPAEntry {
  id: string;
  title: string;
  description: string;
  type: CAPAType;
  source: CAPASource;
  rootCause: string;
  proposedAction: string;
  owner: string;
  dueDate: Date;
  priority: CAPAPriority;
  status: 'open' | 'in-progress' | 'completed' | 'verified' | 'closed';
}

interface CAPACreateProps {
  /** Called after local form submission to persist to the DB. */
  onPersist?: (capa: Omit<CAPAEntry, 'id' | 'status'>) => Promise<void>;
  /** Already-persisted CAPAs from the DB to display alongside local ones. */
  persistedCapas?: CAPAEntry[];
  isPersisting?: boolean;
}

export function CAPACreate({ onPersist, persistedCapas = [], isPersisting = false }: CAPACreateProps) {
  const [capas, setCapas] = useState<CAPAEntry[]>([]);
  const [newCAPA, setNewCAPA] = useState({
    title: '',
    description: '',
    type: 'corrective' as CAPAType,
    source: 'nonconformity' as CAPASource,
    rootCause: '',
    proposedAction: '',
    owner: '',
    dueDate: undefined as Date | undefined,
    priority: 'medium' as CAPAPriority,
  });
  const [isCreating, setIsCreating] = useState(false);

  const createCAPA = async () => {
    if (!newCAPA.title.trim() || !newCAPA.proposedAction.trim()) return;
    setIsCreating(true);

    const dueDate = newCAPA.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const capa: CAPAEntry = {
      id: `capa-${Date.now()}`,
      title: newCAPA.title,
      description: newCAPA.description,
      type: newCAPA.type,
      source: newCAPA.source,
      rootCause: newCAPA.rootCause,
      proposedAction: newCAPA.proposedAction,
      owner: newCAPA.owner,
      dueDate,
      priority: newCAPA.priority,
      status: 'open',
    };

    // Persist to DB if handler provided
    if (onPersist) {
      try {
        await onPersist({ ...capa });
      } catch {
        // persist failed — still add locally so user doesn't lose their work
      }
    }

    setCapas(prev => [...prev, capa]);
    setNewCAPA({
      title: '', description: '', type: 'corrective', source: 'nonconformity',
      rootCause: '', proposedAction: '', owner: '', dueDate: undefined, priority: 'medium',
    });
    setIsCreating(false);
  };

  const updateStatus = (id: string, status: CAPAEntry['status']) => {
    setCapas(prev => prev.map(capa => 
      capa.id === id ? { ...capa, status } : capa
    ));
  };

  const removeCAPA = (id: string) => {
    setCapas(prev => prev.filter(capa => capa.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Create CAPA Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>CAPA Title *</Label>
            <Input
              placeholder="Enter CAPA title..."
              value={newCAPA.title}
              onChange={(e) => setNewCAPA(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={newCAPA.type}
                onValueChange={(value) => setNewCAPA(prev => ({ ...prev, type: value as CAPAType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective Action</SelectItem>
                  <SelectItem value="preventive">Preventive Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Source</Label>
              <Select
                value={newCAPA.source}
                onValueChange={(value) => setNewCAPA(prev => ({ ...prev, source: value as CAPASource }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audit">Audit Finding</SelectItem>
                  <SelectItem value="complaint">Customer Complaint</SelectItem>
                  <SelectItem value="nonconformity">Nonconformity</SelectItem>
                  <SelectItem value="risk">Risk Assessment</SelectItem>
                  <SelectItem value="improvement">Improvement Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the issue..."
              value={newCAPA.description}
              onChange={(e) => setNewCAPA(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Root Cause</Label>
            <Textarea
              placeholder="Describe the root cause analysis..."
              value={newCAPA.rootCause}
              onChange={(e) => setNewCAPA(prev => ({ ...prev, rootCause: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Proposed Action *</Label>
            <Textarea
              placeholder="Describe the proposed corrective/preventive action..."
              value={newCAPA.proposedAction}
              onChange={(e) => setNewCAPA(prev => ({ ...prev, proposedAction: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Owner</Label>
              <Input
                placeholder="Responsible person..."
                value={newCAPA.owner}
                onChange={(e) => setNewCAPA(prev => ({ ...prev, owner: e.target.value }))}
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newCAPA.dueDate ? format(newCAPA.dueDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newCAPA.dueDate}
                    onSelect={(date) => setNewCAPA(prev => ({ ...prev, dueDate: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={newCAPA.priority}
                onValueChange={(value) => setNewCAPA(prev => ({ ...prev, priority: value as CAPAPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={createCAPA}
            disabled={!newCAPA.title.trim() || !newCAPA.proposedAction.trim() || isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create CAPA'}
          </Button>
        </CardContent>
      </Card>

      {capas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CAPA Records ({capas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capas.map((capa) => (
                <div key={capa.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{capa.title}</span>
                        <Badge className={getPriorityColor(capa.priority)}>{capa.priority}</Badge>
                        <Badge className={getStatusColor(capa.status)}>{capa.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{capa.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeCAPA(capa.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span> {capa.type}
                    </div>
                    <div>
                      <span className="text-gray-500">Source:</span> {capa.source}
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span> {capa.owner}
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span> {capa.dueDate ? format(capa.dueDate, 'PPP') : 'TBD'}
                    </div>
                  </div>

                  {capa.rootCause && (
                    <div className="text-sm">
                      <span className="font-medium">Root Cause:</span>
                      <span className="text-gray-600 ml-2">{capa.rootCause}</span>
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-medium">Proposed Action:</span>
                    <span className="text-gray-600 ml-2">{capa.proposedAction}</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    {capa.status === 'open' && (
                      <Button size="sm" onClick={() => updateStatus(capa.id, 'in-progress')}>
                        Start Progress
                      </Button>
                    )}
                    {capa.status === 'in-progress' && (
                      <Button size="sm" onClick={() => updateStatus(capa.id, 'completed')}>
                        Mark Completed
                      </Button>
                    )}
                    {capa.status === 'completed' && (
                      <Button size="sm" onClick={() => updateStatus(capa.id, 'verified')}>
                        Verify
                      </Button>
                    )}
                    {capa.status === 'verified' && (
                      <Button size="sm" onClick={() => updateStatus(capa.id, 'closed')}>
                        Close CAPA
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

