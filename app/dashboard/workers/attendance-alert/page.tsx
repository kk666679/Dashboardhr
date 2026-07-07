"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bell,
  MessageSquare,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Send,
} from "lucide-react";

export default function AttendanceAlertPage() {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);

  const absentWorkers = [
    {
      id: "W001",
      name: "Ahmad Rahman",
      phone: "+60123456789",
      lastSeen: "2024-02-14 17:30",
      worksite: "Construction Site A",
      daysAbsent: 2,
      status: "no_show",
      employer: "ABC Construction Sdn Bhd",
    },
    {
      id: "W003",
      name: "Ram Bahadur",
      phone: "+60187654321",
      lastSeen: "2024-02-13 08:15",
      worksite: "Security Post B",
      daysAbsent: 3,
      status: "missing",
      employer: "Security Plus Sdn Bhd",
    },
  ];

  const handleSelectAll = () => {
    if (selectedWorkers.length === absentWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(absentWorkers.map((w) => w.id));
    }
  };

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId],
    );
  };

  const handleSendAlert = async (method: "sms" | "whatsapp") => {
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSending(false);
    alert(
      `${method.toUpperCase()} alerts sent to ${selectedWorkers.length} workers`,
    );
  };

  const defaultMessages = {
    sms: "Dear worker, you have been absent from work. Please contact your supervisor immediately. - FWMS",
    whatsapp:
      "🚨 Attendance Alert\n\nYou have been marked absent from your assigned worksite. Please contact your supervisor or HR department immediately.\n\nThis is an automated message from FWMS.",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance Alert System
          </h1>
          <p className="text-muted-foreground">
            Send SMS/WhatsApp alerts to absent workers
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absent Workers
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {absentWorkers.length}
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {selectedWorkers.length}
            </div>
            <p className="text-xs text-muted-foreground">For alert</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Cases
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {absentWorkers.filter((w) => w.daysAbsent >= 3).length}
            </div>
            <p className="text-xs text-muted-foreground">3+ days absent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Send
              className={`h-4 w-4 ${sending ? "animate-pulse text-blue-600" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sending ? "Sending" : "Ready"}
            </div>
            <p className="text-xs text-muted-foreground">Alert system</p>
          </CardContent>
        </Card>
      </div>

      {/* Worker Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Workers for Alert</CardTitle>
          <CardDescription>
            Choose absent workers to receive attendance alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={selectedWorkers.length === absentWorkers.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              Select All ({absentWorkers.length} workers)
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Worker Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Worksite</TableHead>
                <TableHead>Days Absent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedWorkers.includes(worker.id)}
                      onCheckedChange={() => handleSelectWorker(worker.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {worker.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {worker.employer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{worker.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{worker.lastSeen}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{worker.worksite}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        worker.daysAbsent >= 3 ? "destructive" : "secondary"
                      }
                    >
                      {worker.daysAbsent} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        worker.status === "missing"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {worker.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      {selectedWorkers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Alert Message</CardTitle>
            <CardDescription>
              Customize the message to send to selected workers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Enter custom message or use default templates..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    {customMessage || defaultMessages.sms}
                  </div>
                  <Button
                    onClick={() => handleSendAlert("sms")}
                    disabled={sending}
                    className="w-full"
                  >
                    {sending ? (
                      <>
                        <Send className="mr-2 h-4 w-4 animate-pulse" />
                        Sending SMS...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send SMS to {selectedWorkers.length} workers
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded whitespace-pre-line">
                    {customMessage || defaultMessages.whatsapp}
                  </div>
                  <Button
                    onClick={() => handleSendAlert("whatsapp")}
                    disabled={sending}
                    className="w-full"
                    variant="outline"
                  >
                    {sending ? (
                      <>
                        <Send className="mr-2 h-4 w-4 animate-pulse" />
                        Sending WhatsApp...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Send WhatsApp to {selectedWorkers.length} workers
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Multi-Language Support
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Messages will be automatically translated to worker's preferred
                language (Bahasa Malaysia, Bengali, Nepali)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
