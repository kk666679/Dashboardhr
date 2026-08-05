"use client";

import { useState } from "react";
import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
  Timeline,
  TimelineEventItem,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Filter } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type AuditEventStatus = "pending" | "running" | "completed";

interface AuditEvent {
  id: string;
  date: Date;
  user: string;
  action: string;
  details: string;
  status: AuditEventStatus;
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const mockEvents: AuditEvent[] = [
  {
    id: "ae-1",
    date: new Date("2026-07-26T10:30:00"),
    user: "John Doe",
    action: "Approved control chart revision",
    details: "Updated UCL and LCL based on new data",
    status: "completed",
  },
  {
    id: "ae-2",
    date: new Date("2026-07-26T09:15:00"),
    user: "Jane Smith",
    action: "Initiated corrective action",
    details: "Non-conformance on Line B",
    status: "running",
  },
  {
    id: "ae-3",
    date: new Date("2026-07-25T14:00:00"),
    user: "Mike Johnson",
    action: "Modified process parameter",
    details: "Changed feed rate from 45 to 50 units/min",
    status: "pending",
  },
  {
    id: "ae-4",
    date: new Date("2026-07-25T11:00:00"),
    user: "Alice Lee",
    action: "Conducted gauge R&R study",
    details: "Results within acceptable limits",
    status: "completed",
  },
  {
    id: "ae-5",
    date: new Date("2026-07-24T16:20:00"),
    user: "Tom B",
    action: "Escalated deviation to quality lead",
    details: "Press #3 vibration anomaly",
    status: "running",
  },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | AuditEventStatus>("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Helper for status badge variant
  const getStatusVariant = (status: AuditEventStatus) => {
    switch (status) {
      case "completed":
        return "secondary";
      case "running":
        return "default";
      case "pending":
        return "outline";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header & Checkpoint */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-sm text-muted-foreground">
            Track all process changes, approvals, and corrective actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Checkpoint>
            <CheckpointIcon />
            <CheckpointTrigger tooltip="Current audit checkpoint: Quarterly process audit">
              <span className="text-sm font-medium">Quarterly Audit</span>
              <Badge variant="outline" className="ml-2">
                In Progress
              </Badge>
            </CheckpointTrigger>
          </Checkpoint>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" /> Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterStatus("all")}
            className={filterStatus === "all" ? "bg-muted" : ""}
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={filterStatus === "pending" ? "bg-muted" : ""}
          >
            Pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterStatus("running")}
            className={filterStatus === "running" ? "bg-muted" : ""}
          >
            In Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterStatus("completed")}
            className={filterStatus === "completed" ? "bg-muted" : ""}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Audit Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
          <CardDescription>Recent and historical audit actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No audit events found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">
                      {event.date.toLocaleString()}
                    </TableCell>
                    <TableCell>{event.user}</TableCell>
                    <TableCell className="font-medium">{event.action}</TableCell>
                    <TableCell className="max-w-xs truncate">{event.details}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Timeline</CardTitle>
          <CardDescription>Chronological view of latest changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline>
            {filteredEvents.slice(0, 5).map((event, index) => (
              <TimelineEventItem
                key={event.id}
                event={{
                  id: event.id,
                  title: event.action,
                  description: event.details,
                  status: event.status,
                  timestamp: event.date,
                }}
                showTimestamp
                isLast={index === filteredEvents.slice(0, 5).length - 1}
              />
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}