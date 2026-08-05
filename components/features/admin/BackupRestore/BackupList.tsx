"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { useToast } from "@/components/ui/use-toast";
import { Cloud, Database, Download, RefreshCw, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";

interface Backup {
  id: string;
  name: string;
  size: string;
  created: string;
  status: "Completed" | "Failed" | "In Progress";
  type: "full" | "incremental" | "schema";
  encrypted: boolean;
  location?: string;
  estimatedRestoreTime?: string;
}

interface BackupListProps {
  onRefresh?: () => void;
}

export function BackupList({ onRefresh }: BackupListProps) {
  const { toast } = useToast();
  const { backups: backupsApi, invalidate } = useAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Fetch real data
  const { data, isLoading, error, refetch } = backupsApi.getAll(undefined, {
    staleTime: 60_000,
  });

  const backups = (data as Backup[]) || [];

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading backups", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  const totalSize = backups.reduce((acc, b) => acc + parseFloat(b.size.replace(/[^0-9.]/g, '') || '0'), 0);
  const stats = {
    total: backups.length,
    completed: backups.filter(b => b.status === "Completed").length,
    failed: backups.filter(b => b.status === "Failed").length,
    totalSize: totalSize.toFixed(2),
  };

  const createBackup = () => {
    setIsCreating(true);
    toast({ title: "Backup initiated", description: "Your backup is being created..." });
    backupsApi.create.mutate(undefined, {
      onSuccess: () => {
        setIsCreating(false);
        toast({ title: "Backup completed", description: "Full backup created successfully." });
        invalidate.backups();
        onRefresh?.();
      },
      onError: (err) => {
        setIsCreating(false);
        toast({ title: "Backup failed", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleRestore = (id: string) => {
    toast({ title: "Restore initiated", description: `Restoring backup ${id}...` });
    backupsApi.restore.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Restore complete", description: "Backup restored successfully." });
        invalidate.backups();
      },
      onError: (err) => {
        toast({ title: "Restore failed", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) return;
    backupsApi.delete.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Backup deleted" });
        invalidate.backups();
        onRefresh?.();
      },
      onError: (err) => {
        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshed", description: "Backup list updated." });
  };

  const runAIPrediction = () => {
    const numSize = parseFloat(stats.totalSize) || 0;
    toast({
      title: "AI Prediction",
      description: `Next full backup size: ~${(numSize * 0.8).toFixed(2)} GB – recommend scheduling for off-peak hours.`,
    });
  };

  return (
    <div className="space-y-6">
      <Agent>
        <AgentHeader
          name="Backup Intelligence Agent"
          model="backup-v1"
          status="idle"
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status="idle" /> Monitoring
            </span>
          }
        />
        <AgentContent>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Total Backups:</span>
              <span className="font-bold ml-1">{stats.total}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-bold ml-1 text-green-500">{stats.completed}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Failed:</span>
              <span className="font-bold ml-1 text-red-500">{stats.failed}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Size:</span>
              <span className="font-bold ml-1">{stats.totalSize} GB</span>
            </div>
            <Button size="sm" onClick={runAIPrediction} className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Predict
            </Button>
          </div>
        </AgentContent>
      </Agent>

      <Suggestions>
        <Suggestion suggestion="💾 Schedule full backup weekly – next due in 2 days" variant="outline" />
        {stats.failed > 0 && (
          <Suggestion suggestion={`📊 ${stats.failed} failed backups – check storage permissions`} variant="outline" />
        )}
        <Suggestion suggestion="🗄️ Migrate old backups to cold storage to save costs" variant="outline" />
      </Suggestions>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={createBackup} disabled={isCreating || backupsApi.create.isPending} className="gap-2">
            {isCreating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Create Backup
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Cloud className="h-4 w-4" />
          Last sync: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Encrypted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading backups...
                </TableCell>
              </TableRow>
            ) : backups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No backups available.
                </TableCell>
              </TableRow>
            ) : (
              backups.map((b) => (
                <TableRow
                  key={b.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedBackup(b)}
                >
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>
                    <Badge variant={b.type === "full" ? "default" : "secondary"}>
                      {b.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{b.size}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(b.created).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        b.status === "Completed"
                          ? "success"
                          : b.status === "Failed"
                          ? "destructive"
                          : "warning"
                      }
                      className="gap-1"
                    >
                      {b.status === "In Progress" && (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {b.encrypted ? (
                      <Badge variant="outline" className="text-green-500">Yes</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-500">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {b.status === "Completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(b.id);
                        }}
                        className="gap-1"
                        disabled={backupsApi.restore.isPending}
                      >
                        <Download className="h-3 w-3" />
                        Restore
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(b.id);
                      }}
                      className="gap-1"
                      disabled={backupsApi.delete.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}