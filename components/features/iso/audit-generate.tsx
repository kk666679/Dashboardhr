'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, Download, Printer, Settings, Clock, User } from 'lucide-react';
import type { ISOStandard, AuditType } from '@/types/iso';

interface AuditGenerateProps {
  standard?: ISOStandard;
  /** Called with standard + selected clauses — returns server-generated checklist. */
  onGenerate?: (standard: ISOStandard, clauses: string[]) => Promise<Array<{ clause: string; questions: string[] }>>;
  isGenerating?: boolean;
  apiError?: string;
}

interface ChecklistItem {
  id: string;
  clause: string;
  question: string;
  category: string;
  selected: boolean;
}

export function AuditGenerate({ standard = 'ISO9001', onGenerate, isGenerating: externalGenerating = false, apiError }: AuditGenerateProps) {
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [auditType, setAuditType] = useState<AuditType>('internal');
  const [generatedChecklist, setGeneratedChecklist] = useState<ChecklistItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState('');

  const clauses = [
    { number: '4.1', title: 'Understanding the organization and its context', category: 'Context' },
    { number: '4.2', title: 'Understanding the needs and expectations of interested parties', category: 'Context' },
    { number: '4.3', title: 'Determining the scope of the QMS', category: 'Context' },
    { number: '5.1', title: 'Leadership and commitment', category: 'Leadership' },
    { number: '5.2', title: 'Quality policy', category: 'Leadership' },
    { number: '5.3', title: 'Organizational roles, responsibilities', category: 'Leadership' },
    { number: '6.1', title: 'Actions to address risks and opportunities', category: 'Planning' },
    { number: '6.2', title: 'Quality objectives and planning', category: 'Planning' },
    { number: '7.1', title: 'Resources', category: 'Support' },
    { number: '7.2', title: 'Competence', category: 'Support' },
    { number: '7.3', title: 'Awareness', category: 'Support' },
    { number: '7.4', title: 'Communication', category: 'Support' },
    { number: '7.5', title: 'Documented information', category: 'Support' },
    { number: '8.1', title: 'Operational planning and control', category: 'Operation' },
    { number: '8.2', title: 'Requirements for products and services', category: 'Operation' },
    { number: '8.3', title: 'Design and development', category: 'Operation' },
    { number: '8.4', title: 'Control of externally provided processes', category: 'Operation' },
    { number: '8.5', title: 'Production and service provision', category: 'Operation' },
    { number: '8.6', title: 'Release of products and services', category: 'Operation' },
    { number: '8.7', title: 'Control of nonconforming outputs', category: 'Operation' },
    { number: '9.1', title: 'Monitoring, measurement, analysis', category: 'Performance' },
    { number: '9.2', title: 'Internal audit', category: 'Performance' },
    { number: '9.3', title: 'Management review', category: 'Performance' },
    { number: '10.1', title: 'General (Improvement)', category: 'Improvement' },
    { number: '10.2', title: 'Nonconformity and corrective action', category: 'Improvement' },
    { number: '10.3', title: 'Continual improvement', category: 'Improvement' },
  ];

  const generateChecklist = async () => {
    setIsGenerating(true);

    let checklist: ChecklistItem[] = [];

    // Use server-generated questions if handler provided
    if (onGenerate) {
      try {
        const serverItems = await onGenerate(standard as ISOStandard, selectedClauses);
        let id = 1;
        serverItems.forEach(item => {
          const clauseDef = clauses.find(c => c.number === item.clause);
          item.questions.forEach(q => {
            checklist.push({
              id: `item-${id++}`,
              clause: item.clause,
              question: q,
              category: clauseDef?.category ?? 'General',
              selected: false,
            });
          });
        });
      } catch { /* fallback to local generation below */ }
    }

    // Local fallback if no server handler or server failed
    if (checklist.length === 0) {
      let id = 1;
      selectedClauses.forEach(clauseNum => {
        const clause = clauses.find(c => c.number === clauseNum);
        if (clause) {
          [
            `Is there evidence that ${clause.title.toLowerCase()} is implemented?`,
            `Are records maintained for ${clause.title.toLowerCase()}?`,
          ].forEach(q => {
            checklist.push({ id: `item-${id++}`, clause: clauseNum, question: q, category: clause.category, selected: false });
          });
        }
      });
    }

    setGeneratedChecklist(checklist);
    setIsGenerating(false);
  };

  const toggleClause = (clauseNumber: string) => {
    setSelectedClauses(prev => 
      prev.includes(clauseNumber)
        ? prev.filter(c => c !== clauseNumber)
        : [...prev, clauseNumber]
    );
  };

  const selectAll = () => {
    setSelectedClauses(clauses.map(c => c.number));
  };

  const selectNone = () => {
    setSelectedClauses([]);
  };

  const toggleChecklistItem = (id: string) => {
    setGeneratedChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const categories = [...new Set(clauses.map(c => c.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Generate Audit Checklist - {standard}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Project Name</Label>
              <Input
                id="project"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="auditType">Audit Type</Label>
              <select
                id="auditType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={auditType}
                onChange={(e) => setAuditType(e.target.value as AuditType)}
              >
                <option value="internal">Internal Audit</option>
                <option value="external">External Audit</option>
                <option value="surveillance">Surveillance Audit</option>
                <option value="certification">Certification Audit</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedClauses.length} clauses selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
              <Button variant="outline" size="sm" onClick={selectNone}>Clear</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(category => (
              <div key={category} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-2">{category}</div>
                <div className="space-y-1">
                  {clauses.filter(c => c.category === category).map(clause => (
                    <div key={clause.number} className="flex items-center gap-2">
                      <Checkbox
                        id={clause.number}
                        checked={selectedClauses.includes(clause.number)}
                        onCheckedChange={() => toggleClause(clause.number)}
                      />
                      <label
                        htmlFor={clause.number}
                        className="text-sm cursor-pointer"
                      >
                        {clause.number}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={generateChecklist} 
            disabled={selectedClauses.length === 0 || isGenerating || externalGenerating}
            className="w-full"
          >
            {(isGenerating || externalGenerating) ? 'Generating...' : 'Generate Checklist'}
          </Button>
          {apiError && <p className="text-sm text-destructive mt-2">{apiError}</p>}
        </CardContent>
      </Card>

      {generatedChecklist.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Checklist ({generatedChecklist.length} items)</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(category => {
                  const categoryItems = generatedChecklist.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="font-medium text-lg mb-3 bg-gray-100 p-2 rounded">{category}</h3>
                      <div className="space-y-2">
                        {categoryItems.map(item => (
                          <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={item.id}
                              checked={item.selected}
                              onCheckedChange={() => toggleChecklistItem(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Clause {item.clause}</Badge>
                                <span className="text-sm font-medium">{item.category}</span>
                              </div>
                              <label
                                htmlFor={item.id}
                                className="text-sm mt-1 block cursor-pointer"
                              >
                                {item.question}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{generatedChecklist.length}</div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {generatedChecklist.filter(i => i.selected).length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {generatedChecklist.filter(i => !i.selected).length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedClauses.length}</div>
                  <div className="text-sm text-gray-600">Clauses Covered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

