"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit2, Trash2 } from "lucide-react";

export interface ForeignWorker {
  id: string;
  name: string;
  passportNo: string;
  nationality: string;
  position: string;
  visaExpiry: Date;
  permitExpiry: Date;
  status: "active" | "pending" | "expired";
}

interface ForeignWorkerListProps {
  workers?: ForeignWorker[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (worker: ForeignWorker) => void;
  onDelete?: (id: string) => void;
}

export function ForeignWorkerList({
  workers = [],
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
}: ForeignWorkerListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Foreign Workers</h2>
          <p className="text-sm text-muted-foreground">
            Manage foreign worker permits and compliance
          </p>
        </div>
        <Button onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border overflow-x-auto">
        <Card className="border-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[120px]">Passport</TableHead>
                <TableHead className="min-w-[100px]">Nationality</TableHead>
                <TableHead className="min-w-[120px]">Position</TableHead>
                <TableHead className="min-w-[100px]">Visa Expiry</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No workers found
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium truncate">
                      {worker.name}
                    </TableCell>
                    <TableCell className="text-sm font-mono truncate">
                      {worker.passportNo}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {worker.nationality}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {worker.position}
                    </TableCell>
                    <TableCell className="text-sm">
                      {worker.visaExpiry.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          worker.status === "active"
                            ? "default"
                            : worker.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {worker.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(worker)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete?.(worker.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 text-center">Loading...</CardContent>
          </Card>
        ) : workers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              No workers found
            </CardContent>
          </Card>
        ) : (
          workers.map((worker) => (
            <Card key={worker.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base">
                      {worker.name}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {worker.passportNo}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(worker)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(worker.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Nationality:</span>
                  <span className="font-medium">{worker.nationality}</span>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium truncate">{worker.position}</span>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Visa Expiry:</span>
                  <span className="font-medium">
                    {worker.visaExpiry.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      worker.status === "active"
                        ? "default"
                        : worker.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {worker.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
