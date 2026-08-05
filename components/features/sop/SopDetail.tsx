'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { useTranslation } from '@/hooks/useTranslation';
import { ROUTE } from '@dashboard-sidebar/route-mapping';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface ProcessStep {
  step: string;
  description: string;
}

interface SopApproval {
  id: string;
  approverRole: string;
  status: string;
  decidedBy: string | null;
}

interface SopVersion {
  id: string;
  version: string;
  status: string;
  changes: string | null;
}

interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function downloadExport(title: string, format: 'MARKDOWN' | 'HTML' | 'PDF', content: string, contentType: string) {
  const extension = format === 'HTML' ? 'html' : format === 'PDF' ? 'pdf' : 'md';
  const payload = format === 'PDF'
    ? Uint8Array.from(atob(content), (char) => char.charCodeAt(0))
    : content;
  const blob = new Blob([payload], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SopDetail({ sopId }: { sopId: string }) {
  const utils = trpc.useUtils();
  const { currentLanguage } = useTranslation();
  const { data: sop, isLoading, error } = trpc.sop.getById.useQuery({ id: sopId });
  const { data: relatedSops = [] } = trpc.sop.related.useQuery({ id: sopId, limit: 5 });
  const [isEditing, setIsEditing] = useState(false);
  const [draftJson, setDraftJson] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const latestVersion = sop?.versions?.[0];
  const content = latestVersion?.content as any;
  const mermaid = latestVersion?.artifacts?.find((artifact: { type?: string; content?: string }) => artifact.type === 'MERMAID')?.content;

  const safeStatus = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value === null) return '';
    return String(value);
  };

  const invalidate = async () => {
    await utils.sop.getById.invalidate({ id: sopId });
    await utils.sop.list.invalidate();
    await utils.sop.getMetrics.invalidate();
  };

  const transitionMutation = trpc.sop.transitionStatus.useMutation({
    onSuccess: async () => {
      setMessage('Status updated.');
      await invalidate();
    },
    onError: (mutationError) => setClientError(mutationError.message),
  });

  const approvalMutation = trpc.sop.recordApproval.useMutation({
    onSuccess: async () => {
      setMessage('Approval decision recorded.');
      await invalidate();
    },
    onError: (mutationError) => setClientError(mutationError.message),
  });

  const updateMutation = trpc.sop.updateContent.useMutation({
    onSuccess: async () => {
      setMessage('Draft content saved.');
      setIsEditing(false);
      await invalidate();
    },
    onError: (mutationError) => setClientError(mutationError.message),
  });

  const exportMutation = trpc.sop.export.useMutation({
    onSuccess: (artifact) => {
      if (!sop) return;
      downloadExport(sop.code, artifact.format, artifact.content, artifact.contentType);
      setMessage(`${artifact.format} export generated.`);
    },
    onError: (mutationError) => setClientError(mutationError.message),
  });

  const createVersionMutation = trpc.sop.createVersion.useMutation({
    onSuccess: async () => {
      setMessage('New draft version created.');
      await invalidate();
    },
    onError: (mutationError) => setClientError(mutationError.message),
  });

  const formattedJson = useMemo(() => JSON.stringify(content ?? {}, null, 2), [content]);

  function startEditing() {
    setClientError(null);
    setMessage(null);
    setDraftJson(formattedJson);
    setIsEditing(true);
  }

  function saveDraft() {
    if (!latestVersion) return;
    try {
      const parsed = JSON.parse(draftJson);
      updateMutation.mutate({ versionId: latestVersion.id, content: parsed });
    } catch {
      setClientError('Draft JSON is invalid. Fix the syntax before saving.');
    }
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading SOP...</div>;
  }

  if (error || !sop || !latestVersion) {
    return <div className="p-6 text-sm text-red-600">Unable to load SOP.</div>;
  }

  const canEdit = latestVersion.status === 'DRAFT';
  const pendingApprovals = asArray<SopApproval>((latestVersion as any).approvals).filter((approval) => {
    return approval.status === "PENDING";
  });


  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{sop.title}</h1>
            <Badge variant="outline">{sop.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{sop.code} | {sop.department} | {sop.category}</p>
        </div>
<div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/automation/sops">Back</Link>
          </Button>
          {canEdit ? <Button variant="outline" onClick={startEditing}>Edit Draft</Button> : null}
          {sop.status === 'DRAFT' ? (
            <Button onClick={() => transitionMutation.mutate({ id: sop.id, to: 'IN_REVIEW' })}>Submit Review</Button>
          ) : null}
          {sop.status === 'PUBLISHED' ? (
            <>
              <Button variant="outline" onClick={() => createVersionMutation.mutate({ id: sop.id, changes: 'New draft version from published SOP' })}>New Version</Button>
              <Button variant="outline" onClick={() => transitionMutation.mutate({ id: sop.id, to: 'ARCHIVED' })}>Archive</Button>
            </>
          ) : null}
        </div>
      </div>

      {message ? (
        <Alert>
          <AlertTitle>Done</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      {clientError ? (
        <Alert variant="destructive">
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{clientError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{latestVersion.complianceScore ?? 0}</div>
            <Progress value={latestVersion.complianceScore ?? 0} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{latestVersion.riskScore ?? 0}</div>
            <Progress value={latestVersion.riskScore ?? 0} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">{latestVersion.auditReadinessScore ?? 0}</div>
            <Progress value={latestVersion.auditReadinessScore ?? 0} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea className="min-h-[520px] font-mono text-xs" value={draftJson} onChange={(event) => setDraftJson(event.target.value)} />
              <div className="flex gap-2">
                <Button onClick={saveDraft} disabled={updateMutation.isPending}>Save Draft</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <section className="space-y-1">
                <h2 className="font-medium">Purpose</h2>
                <p className="text-muted-foreground">{content?.purpose ?? 'No purpose recorded.'}</p>
              </section>
              <section className="space-y-1">
                <h2 className="font-medium">Scope</h2>
                <p className="text-muted-foreground">{content?.scope ?? 'No scope recorded.'}</p>
              </section>
              <section className="space-y-2">
                <h2 className="font-medium">Process Flow</h2>
                <div className="space-y-2">
                  {(asArray<ProcessStep>(content?.processFlow)).map((step, index) => (
                    <div key={`${step.step}-${index}`} className="rounded-md border p-3">
                      <div className="font-medium">{step.step}</div>
                      <div className="text-muted-foreground">{step.description}</div>
                    </div>
                  ))}
                  {asArray<ProcessStep>(content?.processFlow).length === 0 ? <p className="text-muted-foreground">No process steps recorded.</p> : null}
                </div>
              </section>
            </>
          )}
        </CardContent>
      </Card>

      {mermaid ? (
        <Card>
          <CardHeader>
            <CardTitle>Process Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-md bg-muted p-4 text-xs">{mermaid}</pre>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Decided By</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(asArray<SopApproval>(latestVersion.approvals)).map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>{approval.approverRole}</TableCell>
                    <TableCell>{safeStatus(approval.status)}</TableCell>
                    <TableCell>{approval.decidedBy ?? '-'}</TableCell>
                    <TableCell className="flex gap-2">
                      {(() => {
                        return approval.status === 'PENDING' ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => approvalMutation.mutate({ approvalId: approval.id, decision: 'APPROVED' })}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                approvalMutation.mutate({
                                  approvalId: approval.id,
                                  decision: 'REJECTED',
                                  comment: 'Rejected from detail view',
                                })
                              }
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          '-'
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pendingApprovals.length === 0 ? <p className="text-sm text-muted-foreground">No pending approvals for this version.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exports</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(['MARKDOWN', 'HTML', 'PDF'] as const).map((format) => (
              <Button
                key={format}
                variant="outline"
                onClick={() => exportMutation.mutate({ id: sop.id, version: latestVersion.version, format })}
                disabled={exportMutation.isPending}
              >
                {format}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(asArray<SopVersion>(sop.versions)).map((version) => (
              <div key={version.id} className="rounded-md border p-3">
                <div className="font-medium">Version {version.version} | {version.status}</div>
                <div className="text-muted-foreground">{version.changes ?? 'No change summary recorded.'}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(asArray<AuditEvent>(latestVersion.auditEvents)).map((event) => (
              <div key={event.id}>
                <div className="font-medium">{event.action}</div>
                <div className="text-muted-foreground">{event.actor} | {new Date(event.createdAt).toLocaleString()}</div>
                <Separator className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related SOPs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {relatedSops.map((item: { id: string; title: string; code?: string; department?: string; status?: string }) => (
            <Link key={item.id} href={`/automation/sops/${item.id}`} className="rounded-md border p-3 text-sm transition-colors hover:bg-muted">
              <div className="font-medium">{item.title}</div>
              <div className="text-muted-foreground">{item.code} | {item.department} | {item.status}</div>
            </Link>
          ))}
          {relatedSops.length === 0 ? <p className="text-sm text-muted-foreground">No related SOPs found.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}